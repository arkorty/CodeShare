package main

import (
	"log"
	"math/rand" // Import rand package for generating random numbers
	"net/http"
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/labstack/echo"
)

var db *gorm.DB

type Paste struct {
	ID        string    `gorm:"primary_key" json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

func init() {
	var err error
	db, err = gorm.Open("postgres", "host=postgres port=5432 user=postgres dbname=postgres password=postgres sslmode=disable")
	if err != nil {
		panic(err)
	}
	// Auto-migrate database
	db.AutoMigrate(&Paste{})
}

func generateRandomString(length int) string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	bytes := make([]byte, length)
	for i := range bytes {
		bytes[i] = charset[rand.Intn(len(charset))] // Corrected rand to rand.Intn
	}
	return string(bytes)
}

func createPaste(c echo.Context) error {
	paste := new(Paste)
	if err := c.Bind(paste); err != nil {
		return err
	}
	paste.CreatedAt = time.Now()
	paste.ID = generateRandomString(6) // Generate random ID
	db.Create(paste)
	return c.JSON(http.StatusCreated, paste)
}

func getPastes(c echo.Context) error {
	var pastes []Paste
	// Find all pastes from the database
	if err := db.Find(&pastes).Error; err != nil {
		return err
	}
	// Return all pastes as JSON
	return c.JSON(http.StatusOK, pastes)
}

func getPaste(c echo.Context) error {
	id := c.Param("id")
	var paste Paste
	// Use a prepared statement to interpolate the ID parameter into the query
	if err := db.Where("id = ?", id).First(&paste).Error; err != nil {
		// Log the error message
		log.Println("Error retrieving paste:", err)
		return err
	}
	return c.JSON(http.StatusOK, paste)
}

func updatePaste(c echo.Context) error {
	id := c.Param("id")
	var paste Paste
	// Use a prepared statement to interpolate the ID parameter into the query
	if err := db.Where("id = ?", id).First(&paste).Error; err != nil {
		// Log the error message
		log.Println("Error retrieving paste:", err)
		return err
	}
	newPaste := new(Paste)
	if err := c.Bind(newPaste); err != nil {
		return err
	}
	paste.Title = newPaste.Title
	paste.Content = newPaste.Content
	db.Save(&paste)
	return c.JSON(http.StatusOK, paste)
}

func deletePaste(c echo.Context) error {
	id := c.Param("id")
	var paste Paste
	// Use a prepared statement to interpolate the ID parameter into the query
	if err := db.Where("id = ?", id).First(&paste).Error; err != nil {
		// Log the error message
		log.Println("Error retrieving paste:", err)
		return err
	}
	db.Delete(&paste)
	return c.NoContent(http.StatusNoContent)
}

func main() {
	defer db.Close()

	// Initialize Echo instance
	e := echo.New()

	// Define routes
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Backend is running alright.\n")
	})

	// CRUD routes
	e.POST("/pastes", createPaste)
	e.GET("/pastes", getPastes)
	e.GET("/pastes/:id", getPaste)
	e.PUT("/pastes/:id", updatePaste)
	e.DELETE("/pastes/:id", deletePaste)

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}
