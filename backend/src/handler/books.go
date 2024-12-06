package handler

import (
	"fmt"
	"mime/multipart"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unedtamps/PBKKD_EAS/backend/config"
	"github.com/unedtamps/PBKKD_EAS/backend/models"
	"github.com/unedtamps/PBKKD_EAS/backend/src/dto"
	"github.com/unedtamps/PBKKD_EAS/backend/util"
)

func GetBookById(c *gin.Context) {
	request := c.Value("request").(dto.GetBookId)
	book := &models.Book{}
	result := config.DB.Preload("Author").
		Preload("Genre").
		First(&book, "id = ?", uuid.MustParse(request.Id))
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success get book", book)
}

func GetBooksbyName(c *gin.Context) {
	request := c.Value("request").(dto.GetBooksByName)
	books := []models.Book{}
	result := config.DB.Preload("Author").
		Preload("Genre").
		Where("name LIKE ?", fmt.Sprintf("%%%s%%", request.Name)).
		Find(&books)
	if result == nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success get books", books)
}

func CreateBook(c *gin.Context) {
	request := c.Value("request").(dto.CreateBook)
	author_id, _ := uuid.Parse(request.AuthorID)
	genre_id, _ := uuid.Parse(request.GenreID)
	book := models.Book{
		ID:          uuid.New(),
		Name:        request.Name,
		GenreID:     genre_id,
		AuthorID:    author_id,
		Synopsis:    request.Synopsis,
		PDF_url:     request.PDF_URL,
		Picture_URL: request.PIC_URL,
	}
	result := config.DB.Create(&book)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	var newBooks = models.Book{}
	result = config.DB.Preload("Author").Preload("Genre").First(&newBooks, "id = ?", book.ID)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success create book", newBooks)
}

func EditBook(c *gin.Context) {
	request := c.Value("request").(dto.EditBook)
	book := &models.Book{}
	result := config.DB.Preload("Author").Preload("Genre").Where("id = ?", request.Id).First(book)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	if request.Name != "" {
		book.Name = request.Name
	}
	if request.Synopsis != "" {
		book.Synopsis = request.Synopsis
	}
	if request.PDF_URL != "" {
		book.PDF_url = request.PDF_URL
	}
	result = config.DB.Save(book)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success edit book", book)
}

func DeleteBook(c *gin.Context) {
	request := c.Value("request").(dto.DeleteBook)
	book := &models.Book{}
	result := config.DB.Where("id = ?", request.Id).First(book)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	result = config.DB.Delete(book)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success delete book", nil)
}

func GetBooksByAuthor(c *gin.Context) {
	request := c.Value("request").(dto.GetBookByAuthor)
	books := []models.Book{}
	result := config.DB.Where("author_id = ?", request.AuthorID).Find(&books)
	if result == nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success get books", books)
}

func GetBooksByGenre(c *gin.Context) {
	request := c.Value("request").(dto.GetBookByGenre)
	books := []models.Book{}
	result := config.DB.Where("genre_id = ?", request.GenreID).Find(&books)
	if result == nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success get books", books)
}

func GetAllBooks(c *gin.Context) {
	books := []models.Book{}
	result := config.DB.Preload("Author").Preload("Genre").Find(&books)
	if result == nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success get books", books)
}

func GetAllAuthor(c *gin.Context) {
	authors := []models.Author{}
	result := config.DB.Find(&authors)
	if result == nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success get authors", authors)
}

func GetAllGenre(c *gin.Context) {
	genres := []models.Genre{}
	result := config.DB.Find(&genres)
	if result == nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success get genres", genres)
}

func UploadImage(c *gin.Context) {
	file := c.Value("file").(*multipart.FileHeader)
	ext := c.Value("mime")

	path := fmt.Sprintf("%s%s", uuid.NewString(), ext)

	if err := c.SaveUploadedFile(file, fmt.Sprintf("./public/%s", path)); err != nil {
		util.ResponseJson(c, http.StatusInternalServerError, err.Error(), nil)
		c.Abort()
		return
	}

	util.ResponseJson(c, http.StatusCreated, "Success upload file", map[string]string{
		"filename": fmt.Sprintf("/file/%s", path),
	})
}
