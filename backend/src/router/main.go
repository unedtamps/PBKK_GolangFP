package router

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/unedtamps/PBKKD_EAS/backend/config"
	"github.com/unedtamps/PBKKD_EAS/backend/src/dto"
	"github.com/unedtamps/PBKKD_EAS/backend/src/handler"
	m "github.com/unedtamps/PBKKD_EAS/backend/src/middleware"
)

func StartServer() error {
	r := gin.Default()
	r.Static("/file", "./public")
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.GET("/account/all", m.VerifiyJwtToken, handler.GetAllAccounts)
	r.GET("/account/id/:id", m.Validate[dto.GetByID](), handler.GetAccountById)
	r.DELETE("/account/id/:id", m.Validate[dto.GetByID](), handler.DeleteAccoundById)

	r.GET(
		"/account/username/:username",
		m.Validate[dto.GetByUsername](),
		handler.GetAccountByUsername,
	)
	r.GET("/account/email/:email", m.Validate[dto.GetByEmail](), handler.GetAccountByEmail)
	r.POST("/account/register", m.Validate[dto.AcccountRegisterDTO](), handler.CreateAccount)
	r.POST("/account/login", m.Validate[dto.AccountLoginDTO](), handler.LoginAccount)

	r.GET("/book/id/:id", m.VerifiyJwtToken, m.Validate[dto.GetBookId](), handler.GetBookById)
	r.GET(
		"/book/name/:name",
		m.VerifiyJwtToken,
		m.Validate[dto.GetBooksByName](),
		handler.GetBooksbyName,
	)
	r.GET(
		"/book/all",
		m.VerifiyJwtToken,
		handler.GetAllBooks,
	)
	r.GET("/book/authors", m.VerifiyJwtToken, handler.GetAllAuthor)
	r.GET("/book/genres", m.VerifiyJwtToken, handler.GetAllGenre)
	r.GET(
		"/book/genre/:genre_id",
		m.VerifiyJwtToken,
		m.Validate[dto.GetBookByGenre](),
		handler.GetBooksByGenre,
	)
	r.GET(
		"/book/author/:author_id",
		m.VerifiyJwtToken,
		m.Validate[dto.GetBookByAuthor](),
		handler.GetBooksByAuthor,
	)
	r.POST(
		"/book/create",
		m.VerifiyJwtToken,
		m.VerifyAdmin,
		m.Validate[dto.CreateBook](),
		handler.CreateBook,
	)
	r.PATCH(
		"/book/edit",
		m.VerifiyJwtToken,
		m.VerifyAdmin,
		m.Validate[dto.EditBook](),
		handler.EditBook,
	)
	r.DELETE(
		"/book/delete/:id",
		m.VerifiyJwtToken,
		m.VerifyAdmin,
		m.Validate[dto.DeleteBook](),
		handler.DeleteBook,
	)

	r.POST("/borrow/:book_id", m.VerifiyJwtToken, m.Validate[dto.BorrowBook](), handler.BorrowBooks)
	r.GET("/borrow/list", m.VerifiyJwtToken, handler.GetUserBorrowBooks)
	r.GET("/borrow/all", m.VerifiyJwtToken, handler.GetAllBorrows)

	r.POST("/upload", m.UploadFileM, handler.UploadImage)

	return r.Run(fmt.Sprintf(":%s", config.Env.PORT))
}
