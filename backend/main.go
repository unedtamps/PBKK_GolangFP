package main

import (
	"github.com/unedtamps/PBKKD_EAS/backend/config"
	"github.com/unedtamps/PBKKD_EAS/backend/models"
	"github.com/unedtamps/PBKKD_EAS/backend/src/router"
)

func main() {
	config.DB.AutoMigrate(&models.Account{}, &models.Book{}, &models.BookGenre{}, &models.Borrow{})
	router.StartServer()
}
