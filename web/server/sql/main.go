package sql

import (
	"database/sql"
	"fmt"
	// this is for mysql connection
	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
)

func connect() *sql.DB {
	db, err := sql.Open("mysql", "golangTest:thisisatest@/golangtest")
	if err != nil {
		log.Fatal("Could not connect to database")
	}
	return db
}

// Login checks logins.
func Login(res http.ResponseWriter, req *http.Request) {
	db := connect()
	defer db.Close()
	// If method is GET serve an html login page
	if req.Method != "POST" {
		return
	}

	// Grab the username/password from the submitted post form
	username := req.FormValue("username")
	password := req.FormValue("password")

	// Grab from the database
	var databaseUsername string
	var databasePassword string

	// Search the database for the username provided
	// If it exists grab the password for validation
	err := db.QueryRow("SELECT username, password FROM users WHERE username=?", username).Scan(&databaseUsername, &databasePassword)
	// If not then redirect to the login page
	if err != nil {
		http.Redirect(res, req, "/login", 301)
		return
	}

	// Validate the password
	err = bcrypt.CompareHashAndPassword([]byte(databasePassword), []byte(password))
	// If wrong password redirect to the login
	if err != nil {
		http.Redirect(res, req, "/login", 301)
		return
	}

	// If the login succeeded
	res.Write([]byte("Hello " + databaseUsername))
}

// Signup function
func Signup(res http.ResponseWriter, req *http.Request) {
	db := connect()
	defer db.Close()
	// Serve signup.html to get requests to /signup
	if req.Method != "POST" {
		return
	}

	username := req.FormValue("username")
	password := req.FormValue("password")
	email := req.FormValue("email")
	fmt.Print(username, password, email)

	var user string

	err := db.QueryRow("SELECT username FROM users WHERE username=?", username).Scan(&user)

	switch {
	// Username is available
	case err == sql.ErrNoRows:
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(res, "Server error, unable to create your account.", 500)
			return
		}

		_, err = db.Exec("INSERT INTO users(username, password, email) VALUES(?, ?, ?)", username, hashedPassword, email)
		if err != nil {
			http.Error(res, "Server error, unable to create your account.", 500)
			return
		}

		res.Write([]byte("User created!"))
		return
	case err != nil:
		http.Error(res, "Server error, unable to create your account.", 500)
		return
	default:
		http.Redirect(res, req, "/", 301)
	}
}
