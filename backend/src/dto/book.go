package dto

type GetBookId struct {
	Id string `validate:"required" uri:"id"`
}
type GetBooksByName struct {
	Name string `validate:"required" uri:"name"`
}

type CreateBook struct {
	Name     string `validate:"required" json:"name"`
	AuthorID string `validate:"required" json:"author_id"`
	GenreID  string `validate:"required" json:"genre_id"`
	Synopsis string `validate:"required" json:"synopsis"`
	PDF_URL  string `validate:"required" json:"pdf_url"`
	PIC_URL  string `validate:"required" json:"pic_url"`
}
type EditBook struct {
	Id       string `validate:"required" json:"id"`
	Name     string `                    json:"name"`
	Synopsis string `                    json:"synopsis"`
	PDF_URL  string `                    json:"pdf_url"`
}
type DeleteBook struct {
	Id string `validate:"required" uri:"id"`
}
type GetBookByAuthor struct {
	AuthorID string `validate:"required" uri:"author_id"`
}

type GetBookByGenre struct {
	GenreID string `validate:"required" uri:"genre_id"`
}
