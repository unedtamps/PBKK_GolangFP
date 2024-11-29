package models

import "github.com/google/uuid"

type Book struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key"       json:"id"`
	AuthorID    uuid.UUID `gorm:"type:uuid;not null"          json:"-"`
	Author      Author    `gorm:"constraint:OnDelete:CASCADE" json:"author"`
	GenreID     uuid.UUID `gorm:"type:uuid;not null"          json:"-"`
	Genre       Genre     `gorm:"constraint:OnDelete:CASCADE" json:"genre"`
	Name        string    `gorm:"not null"                    json:"name"`
	Synopsis    string    `                                   json:"synopsis"`
	Picture_URL string    `                                   json:"picture_url"`
	PDF_url     string    `gorm:"not null"                    json:"pdf_url"`
}

type Author struct {
	ID   uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	Name string    `gorm:"not null"              json:"name"`
}

type Genre struct {
	ID   uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	Name string    `gorm:"not null"              json:"name"`
}
