package middleware

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/unedtamps/PBKKD_EAS/backend/config"
	"github.com/unedtamps/PBKKD_EAS/backend/util"
)

type Credentials struct {
	Id       string `json:"id"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Role     string `json:"role"`
}

func GetCredentials(c *gin.Context) Credentials {
	return c.Value("cred").(Credentials)
}

func CreateJwtToken(payload interface{}) (string, error) {
	var t *jwt.Token
	claims := jwt.MapClaims{
		"iss":     "library-app",
		"exp":     time.Now().Add(time.Hour * 1).Unix(),
		"payload": payload,
	}
	key := []byte(config.Env.JWT_SECRET)
	t = jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString(key)
}

func VerifiyJwtToken(c *gin.Context) {
	tokenString := c.Request.Header.Get("Authorization")
	if tokenString == "" {
		util.ResponseJson(c, http.StatusBadRequest, "Token not provided", nil)
		c.Abort()
		return
	}
	tokenString = strings.Split(tokenString, "Bearer ")[1]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.Env.JWT_SECRET), nil
	})
	if err != nil {
		util.ResponseJson(c, http.StatusUnauthorized, err.Error(), nil)
		c.Abort()
		return
	}
	if !token.Valid {
		util.ResponseJson(c, http.StatusForbidden, err.Error(), nil)
		c.Abort()
		return
	}
	claims := token.Claims.(jwt.MapClaims)
	payload := claims["payload"].(map[string]interface{})
	data := Credentials{
		Id:       payload["id"].(string),
		Email:    payload["email"].(string),
		Username: payload["username"].(string),
		Role:     payload["role"].(string),
	}
	c.Set("cred", data)
	c.Next()
}

func VerifyAdmin(c *gin.Context) {
	account := c.Value("cred").(Credentials)
	if account.Role != "admin" {
		util.ResponseJson(c, http.StatusForbidden, "Forbidden", nil)
		c.Abort()
		return
	}
	c.Next()
}
