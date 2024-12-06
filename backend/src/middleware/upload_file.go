package middleware

import (
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/unedtamps/PBKKD_EAS/backend/util"
)

func UploadFileM(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 2*1024*1024)
	file, err := c.FormFile("file")
	if err != nil {
		util.ResponseJson(c, http.StatusBadRequest, err.Error(), nil)
		c.Abort()
		return
	}
	ext := filepath.Ext(file.Filename)
	allowed := []string{".jpg", ".png", ".jpeg"}
	if !contains(allowed, ext) {
		util.ResponseJson(c, http.StatusBadRequest, "Mime Type Forbidden", nil)
		c.Abort()
		return
	}
	c.Set("file", file)
	c.Set("mime", ext)
	c.Next()
}

func contains(allowed []string, ext string) bool {
	for _, a := range allowed {
		if a == ext {
			return true
		}
	}
	return false
}
