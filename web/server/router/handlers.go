package router

import (
	"database/sql"
	"encoding/json"
	gql "github.com/chanceeakin/magic-mirror/web/server/graphql"
	// this is for mysql connection
	"crypto"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/securecookie"
	"github.com/sec51/twofactor"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
)

var cookieHandler = securecookie.New(
	securecookie.GenerateRandomKey(64),
	securecookie.GenerateRandomKey(32))

// Connect is the sql connection.
func Connect() *sql.DB {
	db, err := sql.Open("mysql", "golangTest:thisisatest@/golangtest")
	if err != nil {
		log.Fatal("Could not connect to database")
	}
	return db
}

// User is the struct for login!
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

func graphIQL(w http.ResponseWriter, r *http.Request) {
	w.Write(gql.Page)
}

// LoginHandler checks logins.
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	db := Connect()
	defer db.Close()
	// If method is GET serve an html login page
	if r.Method != "POST" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	var request User
	err1 := json.NewDecoder(r.Body).Decode(&request)
	if err1 != nil {
		http.Error(w, err1.Error(), http.StatusBadRequest)
		return
	}

	// Grab the username/password from the submitted post form
	username := request.Username
	password := request.Password

	// Grab from the database
	var databaseUsername string
	var databasePassword string

	// Search the database for the username provided
	// If it exists grab the password for validation
	err := db.QueryRow("SELECT username, password FROM users WHERE username=?", username).Scan(&databaseUsername, &databasePassword)
	// If not then redirect to the login page
	if err != nil {
		val := []byte(`Not Found`)
		jsonVal, _ := json.Marshal(val)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		//Write json response back to response
		w.Write(jsonVal)
		return
	}

	// Validate the password
	err = bcrypt.CompareHashAndPassword([]byte(databasePassword), []byte(password))
	// If wrong password redirect to the login
	if err != nil {
		val := map[string]string{"error": "Unauthorized"}
		jsonVal, err2 := json.Marshal(val)
		if err2 != nil {
			panic(err2)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		//Write json response back to response
		w.Write(jsonVal)
		return
	}

	// If the login succeeded
	values := map[string]string{"username": databaseUsername}
	setSession(databaseUsername, w)

	jsonVal, err := json.Marshal(values)
	if err != nil {
		panic(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	//Write json response back to response
	w.Write(jsonVal)
}

// Signup function
func SignupHandler(w http.ResponseWriter, r *http.Request) {
	db := Connect()
	defer db.Close()
	// Serve signup.html to get requests to /signup
	if r.Method != "POST" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	var request User
	err1 := json.NewDecoder(r.Body).Decode(&request)
	if err1 != nil {
		http.Error(w, err1.Error(), http.StatusBadRequest)
		return
	}

	username := request.Username
	password := request.Password
	email := request.Email

	var user string

	err := db.QueryRow("SELECT username FROM users WHERE username=?", username).Scan(&user)

	switch {
	// Username is available
	case err == sql.ErrNoRows:
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			values := map[string]string{"error": "Unable to create account."}
			jsonVal, err1 := json.Marshal(values)
			if err1 != nil {
				panic(err1)
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			//Write json response back to response
			w.Write(jsonVal)
			return
		}

		_, err = db.Exec("INSERT INTO users(username, password, email) VALUES(?, ?, ?)", username, hashedPassword, email)
		if err != nil {
			values := map[string]string{"error": "Unable to create account."}
			jsonVal, err1 := json.Marshal(values)
			if err1 != nil {
				panic(err1)
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			//Write json response back to response
			w.Write(jsonVal)
			return
		}

		values := map[string]string{"username": username, "email": email}
		jsonVal, _ := json.Marshal(values)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		//Write json response back to response
		w.Write(jsonVal)
		return

	case err != nil:
		values := map[string]string{"error": "Unable to create account."}
		jsonVal, err1 := json.Marshal(values)
		if err1 != nil {
			panic(err1)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		//Write json response back to response
		w.Write(jsonVal)
		return
	default:
		values := map[string]string{"error": "Unable to create account."}
		jsonVal, err1 := json.Marshal(values)
		if err1 != nil {
			panic(err1)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		//Write json response back to response
		w.Write(jsonVal)
		return
	}
}

func setSession(userName string, response http.ResponseWriter) {
	value := map[string]string{
		"username": userName,
	}
	if encoded, err := cookieHandler.Encode("session", value); err == nil {
		cookie := &http.Cookie{
			Name:  "session",
			Value: encoded,
			Path:  "/",
		}
		http.SetCookie(response, cookie)
	}
}

func getUserName(request *http.Request) (userName string) {
	if cookie, err := request.Cookie("session"); err == nil {
		cookieValue := make(map[string]string)
		if err = cookieHandler.Decode("session", cookie.Value, &cookieValue); err == nil {
			userName = cookieValue["username"]
		}
	}
	return userName
}

func clearSession(response http.ResponseWriter) {
	cookie := &http.Cookie{
		Name:   "session",
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	}
	http.SetCookie(response, cookie)
}

// LogoutHandler controls session clearing.
func LogoutHandler(response http.ResponseWriter, request *http.Request) {
	clearSession(response)
	http.Redirect(response, request, "/", 302)
}

// FileHandler sends the entry point of the app
func FileHandler(entrypoint string) func(w http.ResponseWriter, r *http.Request) {
	fn := func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, entrypoint)
	}

	return http.HandlerFunc(fn)
}

func TokenHandler(w http.ResponseWriter, r *http.Request) {
	// db := Connect()
	// defer db.Close()
	otp, err := twofactor.NewTOTP("test@test.com", "meeeeee", crypto.SHA1, 8)
	if err != nil {
		panic(err)
	}

	// _, err = db.Exec("INSERT INTO users(username, password, email) VALUES(?, ?, ?)", username, hashedPassword, email)

	qrBytes, err1 := otp.QR()
	if err1 != nil {
		panic(err1)
	}

	w.Write((qrBytes))
}
