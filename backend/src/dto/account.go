package dto

type AccountLoginDTO struct {
	Email    string `validate:"required,email" json:"email"`
	Password string `validate:"required"       json:"password"`
}
type AcccountRegisterDTO struct {
	Username string `validate:"required"       json:"username"`
	Email    string `validate:"required,email" json:"email"`
	Password string `validate:"required"       json:"password"`
}

type EditAccount struct {
	Id       string `validate:"required" json:"id"`
	Username string `                    json:"username"`
}

type GetByEmail struct {
	Email string `validate:"required,email" uri:"email"`
}
type GetByID struct {
	ID string `validate:"required" uri:"id"`
}
type GetByUsername struct {
	Username string `validate:"required" uri:"username"`
}
