package handler

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unedtamps/PBKKD_EAS/backend/config"
	"github.com/unedtamps/PBKKD_EAS/backend/models"
)

func GetUserById(c *gin.Context) {
	Id, _ := uuid.FromBytes([]byte(c.Param("id")))
	fmt.Println(Id)
	user := models.Account{ID: Id}
	config.DB.First(&user)
	c.JSON(http.StatusOK, gin.H{
		"data": user,
	})
}
