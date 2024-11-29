package dto

type BorrowBook struct {
	BookID string `validate:"required" uri:"book_id"`
}
