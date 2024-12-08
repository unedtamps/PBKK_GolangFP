package handler

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/unedtamps/PBKKD_EAS/backend/config"
	"github.com/unedtamps/PBKKD_EAS/backend/models"
	"github.com/unedtamps/PBKKD_EAS/backend/src/dto"
	"github.com/unedtamps/PBKKD_EAS/backend/src/middleware"
	"github.com/unedtamps/PBKKD_EAS/backend/util"
)

func GetAllAccounts(c *gin.Context) {
	var accounts []models.Account

	result := config.DB.Where("role = ?", "user").Find(&accounts)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}

	util.ResponseJson(c, http.StatusOK, "Success get all accounts", accounts)
}

func GetAccountById(c *gin.Context) {
	request := c.Value("request").(dto.GetByID)
	Id, _ := uuid.Parse(request.ID)
	user := &models.Account{}
	result := config.DB.Where(&models.Account{ID: Id}).First(user)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success get user by id", user)
}

func DeleteAccoundById(c *gin.Context) {
	request := c.Value("request").(dto.GetByID)
	Id, _ := uuid.Parse(request.ID)
	user := &models.Account{}
	result := config.DB.Where(&models.Account{ID: Id}).First(user)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	result = config.DB.Delete(user)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success get delete by id", user)
}

func GetAccountByUsername(c *gin.Context) {
	request := c.Value("request").(dto.GetByUsername)
	user := []models.Account{}
	result := config.DB.Where("username LIKE ?", fmt.Sprintf("%%%s%%", request.Username)).
		Where("role = ?", "user").
		Find(&user)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success get user by username", user)
}

func GetAccountByEmail(c *gin.Context) {
	request := c.Value("request").(dto.GetByEmail)
	user := models.Account{}
	result := config.DB.Where(&models.Account{Email: request.Email}).First(&user)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusOK, "Success get user by email", user)
}

func CreateAccount(c *gin.Context) {
	request := c.Value("request").(dto.AcccountRegisterDTO)
	password, _ := util.GenereateHasedPassword(request.Password)
	accountModel := models.Account{
		ID:       uuid.New(),
		Username: request.Username,
		Email:    request.Email,
		Role:     "user",
		Password: password,
	}
	result := config.DB.Create(&accountModel)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	util.ResponseJson(c, http.StatusCreated, "Success create account", accountModel)
}

// func EditAccount(c *gin.Context) {
// 	request := c.Value("request").(dto.EditAccount)
// 	account := &models.Account{}
// 	result := config.DB.Where("id = ?", request.Id)
// }

func LoginAccount(c *gin.Context) {
	request := c.Value("request").(dto.AccountLoginDTO)
	user := &models.Account{}
	result := config.DB.Where(&models.Account{Email: request.Email}).First(user)
	if result.Error != nil {
		util.ResponseJson(c, http.StatusInternalServerError, result.Error.Error(), nil)
		c.Abort()
		return
	}
	if !util.CompareHashedPassword(user.Password, request.Password) {
		util.ResponseJson(c, http.StatusNotFound, "Email or Password Wrong", nil)
		c.Abort()
		return
	}
	token, _ := middleware.CreateJwtToken(middleware.Credentials{
		Id:       user.ID.String(),
		Email:    user.Email,
		Username: user.Username,
		Role:     string(user.Role),
	})
	responseData := map[string]string{
		"token":    token,
		"id":       user.ID.String(),
		"username": user.Username,
		"email":    user.Email,
		"role":     string(user.Role),
	}

	util.ResponseJson(c, http.StatusCreated, "Success login account", responseData)
}
