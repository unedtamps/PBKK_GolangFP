package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/unedtamps/PBKKD_EAS/backend/src/handler"
)

func StartServer() {
	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/account/:id", handler.GetUserById)
	r.Run(":8080")
}
