package util

import (
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Slugify(input string) string {
	// Convert to lowercase
	slug := strings.ToLower(input)

	// Replace spaces and special characters with hyphens
	slug = regexp.MustCompile(`\s+`).ReplaceAllString(slug, "-")
	slug = regexp.MustCompile(`[^\w-]+`).ReplaceAllString(slug, "")

	return slug
}

func ResponseJson(c *gin.Context, status int, message string, data interface{}) {
	c.JSON(status, gin.H{
		"status":  status,
		"message": message,
		"data":    data,
	})
}

func GenereateHasedPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", nil
	}
	return string(hash), nil
}

func CompareHashedPassword(hashedPassword string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
