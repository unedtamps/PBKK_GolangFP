package models

import "github.com/google/uuid"

type Role string

const (
	Admin Role = "admin"
	User  Role = "user"
)

type Account struct {
	ID       uuid.UUID `gorm:"type:uuid;primary_key"                                        json:"id"`
	Username string    `gorm:"index:usr_idx,unique;not null"                                json:"username"`
	Email    string    `gorm:"index:em_idx,unique;not null"                                 json:"email"`
	Password string    `gorm:"not null"                                                     json:"-"`
	Role     Role      `gorm:"type:varchar(10);check:role IN ('admin','user');default:user" json:"role"`
}
