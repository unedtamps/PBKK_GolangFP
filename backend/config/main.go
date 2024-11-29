package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB
var Dialer *gomail.Dialer

type Environment struct {
	JWT_SECRET  string
	PORT        string
	SMTP_HOST   string
	SMTP_PORT   string
	SENDER_NAME string
	AUTH_EMAIL  string
	AUTH_PASS   string
}

var Env *Environment

func init() {
	var err error
	DB, err = gorm.Open(sqlite.Open("database/data.db"))
	if err != nil {
		log.Fatal(err)
	}
	err = godotenv.Load(".env")
	Env = &Environment{
		JWT_SECRET:  os.Getenv("JWT_SECRET"),
		PORT:        os.Getenv("PORT"),
		SMTP_HOST:   os.Getenv("SMTP_HOST"),
		SMTP_PORT:   os.Getenv("SMTP_PORT"),
		SENDER_NAME: os.Getenv("SENDER_NAME"),
		AUTH_EMAIL:  os.Getenv("AUTH_EMAIL"),
		AUTH_PASS:   os.Getenv("AUTH_PASS"),
	}
	smtp_port, _ := strconv.Atoi(Env.SMTP_PORT)
	Dialer = gomail.NewDialer(
		Env.SMTP_HOST,
		smtp_port,
		Env.AUTH_EMAIL,
		Env.AUTH_PASS,
	)

}
