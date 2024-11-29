package models

import (
	"time"

	"github.com/google/uuid"
)

type Borrow struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key"              json:"id"`
	AccountID uuid.UUID `gorm:"type:uuid;not null"                 json:"-"`
	Account   Account   `gorm:"constraint:OnDelete:CASCADE"        json:"account"`
	BookID    uuid.UUID `gorm:"type:uuid;not null"                 json:"-"`
	Book      Book      `gorm:"constraint:OnDelete:CASCADE"        json:"book"`
	IsSended  bool      `gorm:"not null"                           json:"-"`
	CreatedAt time.Time `gorm:"not null;default:CURRENT_TIMESTAMP" json:"-"`
	UpdatedAt time.Time `                                          json:"-"`
}
