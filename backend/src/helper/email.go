package helper

import (
	"fmt"
	"log"
	"sync"

	"github.com/unedtamps/PBKKD_EAS/backend/config"
	"github.com/unedtamps/PBKKD_EAS/backend/models"
	"gopkg.in/gomail.v2"
)

func SendBookURLToUser() {
	// get book url not yet sended
	log.Println("Start Send Batch Email")
	borrowsBooks := []models.Borrow{}
	config.DB.Where("is_sended = ?", false).Find(&borrowsBooks)
	// user go concurrency
	var wg sync.WaitGroup
	for _, borrow := range borrowsBooks {
		wg.Add(1)
		go SendEmail(&wg, borrow)
	}
	wg.Wait()
	log.Println("End Send Batch Email")
}

func SendEmail(wg *sync.WaitGroup, br models.Borrow) {
	defer wg.Done()
	// get the user and the book
	user := models.Account{}
	config.DB.Where("id = ?", br.AccountID).First(&user)
	book := models.Book{}
	config.DB.Where("id = ?", br.BookID).First(&book)
	body := `
  <h1>Book Access Link</h1>
  <p>Click <a href="%s">here</a> to access the book</p>
  `

	log.Println("Try to send email")
	mailer := gomail.NewMessage()
	mailer.SetHeader("From", config.Env.SENDER_NAME)
	mailer.SetHeader("To", user.Email)
	mailer.SetHeader("Subject", "Book Access Link")
	mailer.SetBody("text/html", fmt.Sprintf(body, book.PDF_url))
	err := config.Dialer.DialAndSend(mailer)
	if err != nil {
		log.Println(err.Error())
		return
	}
	// update borrow isSended True
	br.IsSended = true
	config.DB.Save(&br)
	log.Printf("Email sent to %s", user.Email)
}
