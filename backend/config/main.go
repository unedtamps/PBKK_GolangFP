package config

import (
	"log"

	"github.com/go-playground/validator/v10"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB
var Validate *validator.Validate

func init() {
	var err error
	DB, err = gorm.Open(sqlite.Open("database/data.db"))
	if err != nil {
		log.Fatal(err)
	}
	Validate = validator.New(validator.WithRequiredStructEnabled())
}
