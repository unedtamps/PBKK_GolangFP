package models

import "github.com/google/uuid"

type Book struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key"       json:"id"`
	AuthorID    uuid.UUID `gorm:"type:uuid;not null"          json:"author_id"`
	Author      Author    `gorm:"constraint:OnDelete:CASCADE"`
	Name        string    `gorm:"not null"                    json:"name"`
	Synopsis    string    `                                   json:"synopsis"`
	Picture_URL string    `                                   json:"picture_url"`
	PDF_url     string    `gorm:"not null"                    json:"pdf_url"`
}

type Author struct {
	ID   uuid.UUID `gorm:"type:uuid;primary_key"`
	Name string    `gorm:"not null"`
}

type Genre struct {
	ID   uuid.UUID `gorm:"type:uuid;primary_key"`
	Name string    `gorm:"not null"`
}

type BookGenre struct {
	ID      uuid.UUID `gorm:"type:uuid;primary_key"`
	BookID  uuid.UUID `gorm:"type:uuid;not null"`
	Book    Book      `gorm:"constraint:OnDelete:CASCADE"`
	GenreID uuid.UUID `gorm:"type:uuid;not null"`
	Genre   Genre     `gorm:"constraint:OnDelete:CASCADE"`
}
