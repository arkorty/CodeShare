package main

import (
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"
	"fmt"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

var db *gorm.DB

type Paste struct {
	ID        string    `gorm:"primary_key;unique" json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Lang      string    `gorm:"type:varchar(16)" json:"lang"`
	CreatedAt time.Time `json:"created_at"`
}

func init() {
	var err error
	db, err = gorm.Open("postgres", fmt.Sprintf(
		"host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_SSLMODE"),
	))
	if err != nil {
		panic(err)
	}

	db.AutoMigrate(&Paste{})
}

func generateRandomString(length int) string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	bytes := make([]byte, length)
	for i := range bytes {
		bytes[i] = charset[rand.Intn(len(charset))]
	}
	return string(bytes)
}

func createPaste(c echo.Context) error {
	paste := new(Paste)
	if err := c.Bind(paste); err != nil {
		return err
	}

	for {
		paste.ID = generateRandomString(6)

		var existingPaste Paste
		if err := db.Where("id = ?", paste.ID).First(&existingPaste).Error; err != nil && gorm.IsRecordNotFoundError(err) {
			break
		}
	}

	paste.CreatedAt = time.Now()
	if err := db.Create(paste).Error; err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, paste)
}

func getPastes(c echo.Context) error {
	var pastes []Paste
	if err := db.Find(&pastes).Error; err != nil {
		return err
	}
	return c.JSON(http.StatusOK, pastes)
}

func getPaste(c echo.Context) error {
	id := c.Param("id")
	var paste Paste
	if err := db.Where("id = ?", id).First(&paste).Error; err != nil {
		log.Println("Error retrieving paste:", err)
		return err
	}
	return c.JSON(http.StatusOK, paste)
}

func updatePaste(c echo.Context) error {
	id := c.Param("id")
	var paste Paste
	if err := db.Where("id = ?", id).First(&paste).Error; err != nil {
		log.Println("Error retrieving paste:", err)
		return err
	}
	newPaste := new(Paste)
	if err := c.Bind(newPaste); err != nil {
		return err
	}
	paste.Title = newPaste.Title
	paste.Content = newPaste.Content
	paste.Lang = newPaste.Lang
	db.Save(&paste)
	return c.JSON(http.StatusOK, paste)
}

func deletePaste(c echo.Context) error {
	id := c.Param("id")
	var paste Paste
	if err := db.Where("id = ?", id).First(&paste).Error; err != nil {
		log.Println("Error retrieving paste:", err)
		return err
	}
	db.Delete(&paste)
	return c.NoContent(http.StatusNoContent)
}

func main() {
	defer db.Close()

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
	}))

	e.GET("/codeshare/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Backend is running alright.\n")
	})

	e.POST("/codeshare/pastes", createPaste)
	e.GET("/codeshare/pastes", getPastes)
	e.GET("/codeshare/pastes/:id", getPaste)
	e.PUT("/codeshare/pastes/:id", updatePaste)
	e.DELETE("/codeshare/pastes/:id", deletePaste)

	e.Logger.Fatal(e.Start(":8080"))
}
