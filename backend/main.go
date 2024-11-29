package main

import (
	"log"
	"os"

	"github.com/robfig/cron"
	"github.com/unedtamps/PBKKD_EAS/backend/config"
	"github.com/unedtamps/PBKKD_EAS/backend/database/seeder"
	"github.com/unedtamps/PBKKD_EAS/backend/models"
	"github.com/unedtamps/PBKKD_EAS/backend/src/helper"
	"github.com/unedtamps/PBKKD_EAS/backend/src/router"
)

func main() {
	c := cron.New()
	c.AddFunc("@every 1m", helper.SendBookURLToUser)
	log.Println("Start cron")
	c.Start()

	if len(os.Args) < 2 {
		log.Println("No arguments provided. Starting server...")
		err := router.StartServer()
		if err != nil {
			log.Fatal(err)
		}
	} else {
		arg := os.Args[1]
		switch arg {
		case "migrate":
			log.Println("Running migrations...")
			config.DB.AutoMigrate(&models.Account{}, &models.Book{}, &models.Borrow{})
			break
		case "seed":
			log.Println("Seeding database...")
			seeder.SeedDb()
			break
		default:
			log.Printf("Unknown argument: %s.\n", arg)
			break
		}
	}
}
