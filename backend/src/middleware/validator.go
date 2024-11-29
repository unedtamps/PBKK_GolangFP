package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/unedtamps/PBKKD_EAS/backend/util"
)

var validate *validator.Validate

func init() {
	validate = validator.New(validator.WithRequiredStructEnabled())
}

func Validate[T any]() gin.HandlerFunc {
	return func(c *gin.Context) {
		var Data T

		if err := c.ShouldBindJSON(&Data); err != nil {
			if err := c.ShouldBindUri(&Data); err != nil {
				util.ResponseJson(c, http.StatusBadRequest, err.Error(), nil)
				c.Abort()
				return
			}
		}
		if err := validate.Struct(Data); err != nil {
			util.ResponseJson(c, http.StatusBadRequest, err.Error(), nil)
			c.Abort()
			return
		}
		c.Set("request", Data)
		c.Next()
	}
}
