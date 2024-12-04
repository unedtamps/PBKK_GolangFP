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
