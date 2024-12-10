package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unedtamps/PBKKD_EAS/backend/config"
	"github.com/unedtamps/PBKKD_EAS/backend/models"
	"github.com/unedtamps/PBKKD_EAS/backend/src/dto"
	"github.com/unedtamps/PBKKD_EAS/backend/src/middleware"
	"github.com/unedtamps/PBKKD_EAS/backend/util"
)

func BorrowBooks(c *gin.Context) {
	req := c.Value("request").(dto.BorrowBook)
	cred := c.Value("cred").(middleware.Credentials)
	account_id, _ := uuid.Parse(cred.Id)
	book_id, _ := uuid.Parse(req.BookID)
	// check terlebih dahulu hanya boleh pinjam 2 buku sehari

	checkBorrow := []models.Borrow{}
	config.DB.Where("account_id = ? AND created_at >= ?", account_id, time.Now().AddDate(0, 0, -1)).
		Find(&checkBorrow)
	if len(checkBorrow) >= 2 {
		util.ResponseJson(c, 400, "You have borrowed 2 books today", nil)
		c.Abort()
		return
	}

	borrow := models.Borrow{
		ID:        uuid.New(),
		AccountID: account_id,
		BookID:    book_id,
		IsSended:  false,
		CreatedAt: time.Now(),
	}

	result := config.DB.Create(&borrow)
	if result.Error != nil {
		util.ResponseJson(c, 400, result.Error.Error(), nil)
		c.Abort()
		return
	}
	borrowData := models.Borrow{}
	result = config.DB.Preload("Account").
		Preload("Book.Author").Preload("Book.Genre").
		Where("id = ?", borrow.ID).
		First(&borrowData)

	if result.Error != nil {
		util.ResponseJson(c, 400, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, 200, "Success borrow book", borrowData)
}

func GetUserBorrowBooks(c *gin.Context) {
	cred := c.Value("cred").(middleware.Credentials)
	var borrows []models.Borrow
	result := config.DB.Preload("Account").
		Preload("Book.Author").
		Preload("Book.Genre").
		Where("account_id = ?", uuid.MustParse(cred.Id)).
		Find(&borrows)
	if result == nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, 200, "Success get user borrow books", borrows)
}

func GetAllBorrows(c *gin.Context) {
	var borrows []models.Borrow

	result := config.DB.Preload("Account").
		Preload("Book.Author").
		Preload("Book.Genre").
		Find(&borrows)

	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}

	util.ResponseJson(c, 200, "Success get all borrows", borrows)
}

func FilterBorrowHistory(c *gin.Context) {
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	var borrows []models.Borrow
	query := config.DB.Preload("Account").Preload("Book.Author").Preload("Book.Genre")

	if startDate != "" && endDate != "" {
		start, errStart := time.Parse("2006-01-02", startDate)
		end, errEnd := time.Parse("2006-01-02", endDate)
		if errStart != nil || errEnd != nil {
			util.ResponseJson(c, http.StatusBadRequest, "Invalid date format. Use YYYY-MM-DD.", nil)
			return
		}
		query = query.Where("created_at BETWEEN ? AND ?", start, end)

	}

	result := query.Find(&borrows)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		return
	}

	util.ResponseJson(c, 200, "Filtered borrow history", borrows)
}

func GetMostBorrowedBooks(c *gin.Context) {
	var results []struct {
		BookID      uuid.UUID `json:"book_id"`
		BookName    string    `json:"book_name"`
		Author      string    `json:"author"`
		Genre       string    `json:"genre"`
		Synopsis    string    `json:"synopsis"`
		Picture_URL string    `json:"picture_url"`
		Borrowed    int       `json:"borrowed_count"`
	}

	query := `
        SELECT 
            books.id AS book_id, 
            books.name AS book_name, 
            authors.name AS author, 
            genres.name AS genre, 
            books.synopsis AS synopsis,
			books.picture_url AS picture_url,
            COUNT(borrows.book_id) AS borrowed_count
        FROM borrows
        INNER JOIN books ON borrows.book_id = books.id
        INNER JOIN authors ON books.author_id = authors.id
        INNER JOIN genres ON books.genre_id = genres.id
        GROUP BY books.id, books.name, authors.name, genres.name, books.synopsis, books.picture_url
        ORDER BY borrowed_count DESC
        LIMIT 5;
    `

	result := config.DB.Raw(query).Scan(&results)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		return
	}

	util.ResponseJson(c, 200, "Most borrowed books", results)
}

func GetMonthlyBorrowStats(c *gin.Context) {
	var results []struct {
		Month string `json:"month"`
		Year  int    `json:"year"`
		Count int    `json:"count"`
	}

	query := `
        SELECT 
            strftime('%Y', created_at) AS year, 
            strftime('%m', created_at) AS month,
            COUNT(*) AS count
        FROM borrows
        WHERE created_at >= DATE('now', '-4 months', 'start of month') 
        GROUP BY year, month
        ORDER BY year DESC, month ASC;
    `

	result := config.DB.Raw(query).Scan(&results)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		return
	}

	util.ResponseJson(c, 200, "Borrow stats per month", results)
}
