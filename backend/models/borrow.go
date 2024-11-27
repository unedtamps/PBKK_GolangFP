package models

import (
	"time"

	"github.com/google/uuid"
)

type Borrow struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key"`
	AccountID uuid.UUID `gorm:"type:uuid;not null"`
	Account   Account   `gorm:"constraint:OnDelete:CASCADE"`
	BookID    uuid.UUID `gorm:"type:uuid;not null"`
	Book      Book      `gorm:"constraint:OnDelete:CASCADE"`
	CreatedAt time.Time `gorm:"not null;default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time
}
