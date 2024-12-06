package seeder

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"github.com/unedtamps/PBKKD_EAS/backend/models"
	"github.com/unedtamps/PBKKD_EAS/backend/util"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func SeedDb() {
	var err error
	db, err = gorm.Open(sqlite.Open("database/data.db"), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	Accout()
	Books()
}

func Accout() {
	passowrd, _ := util.GenereateHasedPassword("password")
	account := []models.Account{
		models.Account{
			ID:       uuid.New(),
			Username: "unedo",
			Email:    "unedo@gmail.com",
			Role:     "user",
			Password: passowrd,
		},
		models.Account{
			ID:       uuid.New(),
			Username: "viery",
			Email:    "viery@gmail.com",
			Role:     "user",
			Password: passowrd,
		},
		models.Account{
			ID:       uuid.New(),
			Username: "admin",
			Email:    "admin@gmail.com",
			Role:     "admin",
			Password: passowrd,
		},
	}
	db.Create(account)
}

func Books() {
	authors, mapAuthors, authorBooks := Author()
	mapBookGenres, bookGenres := BookGenres()
	bookSysnopsis := BookSynopsisMap()
	bookIDs := make(map[string]uuid.UUID)
	// insert book genres first
	db.Create(authors)
	db.Create(bookGenres)
	var books []models.Book
	var j = 0
	// create books
	for a, b := range mapAuthors {
		for _, book := range authorBooks[a] {
			idBook := uuid.New()
			books = append(books, models.Book{
				ID:          idBook,
				AuthorID:    b,
				Name:        book,
				Picture_URL: fmt.Sprintf("/file/example%d.jpg", j%4),
				PDF_url:     generateRandomURL("http://library.com/pdf/"),
				Synopsis:    bookSysnopsis[book],
				GenreID:     mapBookGenres[book],
			})
			bookIDs[book] = idBook
			j++
		}
	}
	db.Create(books)
}

func generateRandomURL(base string) string {
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	rand.Seed(time.Now().UnixNano())
	url := base
	for i := 0; i < 10; i++ {
		url += string(letters[rand.Intn(len(letters))])
	}
	return url
}

func BookSynopsisMap() map[string]string {
	// Map of books and their synopses
	bookSynopses := map[string]string{
		"Harry Potter and the Sorcerer's Stone":   "Harry discovers he's a wizard and begins his magical education at Hogwarts, where he confronts the dark wizard Voldemort.",
		"Harry Potter and the Chamber of Secrets": "Harry returns to Hogwarts and uncovers the mystery of the Chamber of Secrets while battling an ancient basilisk.",
		"1984":                                   "In a dystopian future, Winston Smith struggles against a totalitarian regime led by Big Brother.",
		"Animal Farm":                            "A satirical tale about a group of farm animals who overthrow their human owner, only to fall under the tyranny of one of their own.",
		"The Hobbit":                             "Bilbo Baggins, a hobbit, embarks on an adventurous quest to reclaim a mountain treasure guarded by a dragon.",
		"The Lord of the Rings":                  "Frodo Baggins and his companions embark on a journey to destroy the One Ring and defeat the dark lord Sauron.",
		"Pride and Prejudice":                    "Elizabeth Bennet navigates issues of manners, morality, and marriage in 19th-century England.",
		"Sense and Sensibility":                  "The Dashwood sisters navigate love, heartbreak, and societal expectations in Regency-era England.",
		"The Adventures of Tom Sawyer":           "Tom Sawyer embarks on adventures in a small-town setting along the Mississippi River.",
		"Adventures of Huckleberry Finn":         "Huck Finn journeys down the Mississippi River with an escaped slave named Jim, encountering moral dilemmas along the way.",
		"A Tale of Two Cities":                   "Set during the French Revolution, this novel explores themes of sacrifice and resurrection.",
		"Great Expectations":                     "The coming-of-age story of Pip, an orphan who seeks love, wealth, and personal growth.",
		"The Old Man and the Sea":                "An aging fisherman battles a giant marlin in the Gulf Stream, reflecting on life and struggle.",
		"A Farewell to Arms":                     "A tragic love story set against the backdrop of World War I.",
		"The Great Gatsby":                       "A tale of wealth, love, and ambition set in the Jazz Age of 1920s America.",
		"Tender Is the Night":                    "A story of love, betrayal, and psychological struggles among wealthy expatriates in the French Riviera.",
		"War and Peace":                          "A sweeping narrative of Russian society during the Napoleonic Wars, focusing on family, love, and duty.",
		"Anna Karenina":                          "A tale of love, betrayal, and societal judgment in imperial Russia.",
		"To Kill a Mockingbird":                  "Scout Finch narrates a story of racial injustice and moral growth in the American South.",
		"Go Set a Watchman":                      "Scout Finch returns to Maycomb, Alabama, as an adult and grapples with her past and family.",
		"Murder on the Orient Express":           "Detective Hercule Poirot solves a murder on a luxurious train journey.",
		"The Murder of Roger Ackroyd":            "Poirot investigates the murder of a wealthy man in a small village.",
		"To the Lighthouse":                      "A family’s trip to a lighthouse serves as a metaphor for life, art, and time.",
		"Mrs. Dalloway":                          "A single day in the life of Clarissa Dalloway, as she reflects on her past and plans a party.",
		"One Hundred Years of Solitude":          "The multigenerational story of the Buendía family in the fictional town of Macondo.",
		"Love in the Time of Cholera":            "A tale of enduring love between Florentino Ariza and Fermina Daza over decades.",
		"Moby-Dick":                              "Captain Ahab obsessively hunts the white whale Moby Dick, symbolizing man's struggle against nature.",
		"Bartleby, the Scrivener":                "The story of a law clerk who refuses to conform to workplace expectations with his phrase, 'I would prefer not to.'",
		"The Picture of Dorian Gray":             "A young man remains youthful while his portrait ages, reflecting his moral decay.",
		"The Importance of Being Earnest":        "A comedic play about mistaken identities and social conventions in Victorian England.",
		"The Metamorphosis":                      "Gregor Samsa wakes up one morning transformed into a giant insect, struggling with alienation and family expectations.",
		"The Trial":                              "Josef K. faces an opaque legal system after being arrested without explanation.",
		"The Sound and the Fury":                 "A Southern family’s decline is narrated through multiple perspectives, exploring time and memory.",
		"As I Lay Dying":                         "The Bundren family’s journey to bury their mother, told through multiple voices.",
		"The Raven":                              "A dark and melancholic poem about loss and mourning, centered on a talking raven.",
		"The Tell-Tale Heart":                    "A suspenseful tale of guilt and madness, told by an unreliable narrator who has committed murder.",
		"Wuthering Heights":                      "A tale of passionate and destructive love set on the Yorkshire moors.",
		"Poems by Currer, Ellis, and Acton Bell": "A collection of poems by the Brontë sisters under their male pseudonyms.",
		"Ulysses":                                "A modernist reimagining of Homer’s 'Odyssey,' set in a single day in Dublin.",
		"Dubliners":                              "A collection of short stories capturing everyday life in Dublin, Ireland.",
	}

	return bookSynopses
}

func Author() ([]models.Author, map[string]uuid.UUID, map[string][]string) {
	AuthorMap := make(map[string]uuid.UUID)
	AuthorBook := make(map[string][]string)
	authorsAndBooks := map[string][]string{
		"J.K. Rowling": {
			"Harry Potter and the Sorcerer's Stone",
			"Harry Potter and the Chamber of Secrets",
		},
		"George Orwell":  {"1984", "Animal Farm"},
		"J.R.R. Tolkien": {"The Hobbit", "The Lord of the Rings"},
		"Jane Austen":    {"Pride and Prejudice", "Sense and Sensibility"},
		"Mark Twain": {
			"The Adventures of Tom Sawyer",
			"Adventures of Huckleberry Finn",
		},
		"Charles Dickens":        {"A Tale of Two Cities", "Great Expectations"},
		"Ernest Hemingway":       {"The Old Man and the Sea", "A Farewell to Arms"},
		"F. Scott Fitzgerald":    {"The Great Gatsby", "Tender Is the Night"},
		"Leo Tolstoy":            {"War and Peace", "Anna Karenina"},
		"Harper Lee":             {"To Kill a Mockingbird", "Go Set a Watchman"},
		"Agatha Christie":        {"Murder on the Orient Express", "The Murder of Roger Ackroyd"},
		"Virginia Woolf":         {"To the Lighthouse", "Mrs. Dalloway"},
		"Gabriel Garcia Marquez": {"One Hundred Years of Solitude", "Love in the Time of Cholera"},
		"Herman Melville":        {"Moby-Dick", "Bartleby, the Scrivener"},
		"Oscar Wilde":            {"The Picture of Dorian Gray", "The Importance of Being Earnest"},
		"Franz Kafka":            {"The Metamorphosis", "The Trial"},
		"William Faulkner":       {"The Sound and the Fury", "As I Lay Dying"},
		"Edgar Allan Poe":        {"The Raven", "The Tell-Tale Heart"},
		"Emily Bronte":           {"Wuthering Heights", "Poems by Currer, Ellis, and Acton Bell"},
		"James Joyce":            {"Ulysses", "Dubliners"},
	}
	var authors []models.Author
	for author, book := range authorsAndBooks {
		AuthorMap[author] = uuid.New()
		AuthorBook[author] = book
		authors = append(authors, models.Author{
			ID:   AuthorMap[author],
			Name: author,
		})
	}
	return authors, AuthorMap, AuthorBook
}
func BookGenres() (map[string]uuid.UUID, []models.Genre) {
	genres := []string{
		"Fantasy", "Dystopian", "Adventure", "Romance",
		"Historical Fiction", "Mystery", "Modernist", "Magical Realism",
		"Classic", "Gothic", "Science Fiction",
	}

	genreUUIDs := make(map[string]uuid.UUID)
	for _, genre := range genres {
		genreUUIDs[genre] = uuid.New()
	}

	bookGenres := map[string]uuid.UUID{
		"Harry Potter and the Sorcerer's Stone":   genreUUIDs["Fantasy"],
		"Harry Potter and the Chamber of Secrets": genreUUIDs["Fantasy"],
		"1984":                                   genreUUIDs["Dystopian"],
		"Animal Farm":                            genreUUIDs["Dystopian"],
		"The Hobbit":                             genreUUIDs["Fantasy"],
		"The Lord of the Rings":                  genreUUIDs["Fantasy"],
		"Pride and Prejudice":                    genreUUIDs["Romance"],
		"Sense and Sensibility":                  genreUUIDs["Romance"],
		"The Adventures of Tom Sawyer":           genreUUIDs["Adventure"],
		"Adventures of Huckleberry Finn":         genreUUIDs["Adventure"],
		"A Tale of Two Cities":                   genreUUIDs["Historical Fiction"],
		"Great Expectations":                     genreUUIDs["Classic"],
		"The Old Man and the Sea":                genreUUIDs["Modernist"],
		"A Farewell to Arms":                     genreUUIDs["Romance"],
		"The Great Gatsby":                       genreUUIDs["Modernist"],
		"Tender Is the Night":                    genreUUIDs["Romance"],
		"War and Peace":                          genreUUIDs["Historical Fiction"],
		"Anna Karenina":                          genreUUIDs["Romance"],
		"To Kill a Mockingbird":                  genreUUIDs["Classic"],
		"Go Set a Watchman":                      genreUUIDs["Classic"],
		"Murder on the Orient Express":           genreUUIDs["Mystery"],
		"The Murder of Roger Ackroyd":            genreUUIDs["Mystery"],
		"To the Lighthouse":                      genreUUIDs["Modernist"],
		"Mrs. Dalloway":                          genreUUIDs["Modernist"],
		"One Hundred Years of Solitude":          genreUUIDs["Magical Realism"],
		"Love in the Time of Cholera":            genreUUIDs["Romance"],
		"Moby-Dick":                              genreUUIDs["Adventure"],
		"Bartleby, the Scrivener":                genreUUIDs["Classic"],
		"The Picture of Dorian Gray":             genreUUIDs["Gothic"],
		"The Importance of Being Earnest":        genreUUIDs["Classic"],
		"The Metamorphosis":                      genreUUIDs["Modernist"],
		"The Trial":                              genreUUIDs["Modernist"],
		"The Sound and the Fury":                 genreUUIDs["Modernist"],
		"As I Lay Dying":                         genreUUIDs["Modernist"],
		"The Raven":                              genreUUIDs["Gothic"],
		"The Tell-Tale Heart":                    genreUUIDs["Gothic"],
		"Wuthering Heights":                      genreUUIDs["Gothic"],
		"Poems by Currer, Ellis, and Acton Bell": genreUUIDs["Classic"],
		"Ulysses":                                genreUUIDs["Modernist"],
		"Dubliners":                              genreUUIDs["Modernist"],
	}
	var gen []models.Genre

	for g, v := range genreUUIDs {
		gen = append(gen, models.Genre{
			ID:   v,
			Name: g,
		})
	}
	return bookGenres, gen
}
