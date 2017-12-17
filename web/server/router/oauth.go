package router

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"

	"encoding/json"
	"errors"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/plus/v1"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

type credentials struct {
	Cid     string `json:"client_id"`
	Csecret string `json:"client_secret"`
}

// RandToken generates a random state token.
func RandToken(l int) string {
	b := make([]byte, l)
	rand.Read(b)
	return base64.StdEncoding.EncodeToString(b)
}

var conf *oauth2.Config

func init() {
	var c credentials
	secrets, err := ioutil.ReadFile("./keys/client_secret.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}
	json.Unmarshal(secrets, &c)
	os.Setenv("googlekey", c.Cid)
	os.Setenv("googlesecret", c.Csecret)
	conf = configInit()
}

var oauthStateString = RandToken(32)

func configInit() *oauth2.Config {
	var c = &oauth2.Config{
		ClientID:     os.Getenv("googlekey"),
		ClientSecret: os.Getenv("googlesecret"),
		RedirectURL:  "http://localhost:8000/auth",
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/plus.login",
			"https://www.googleapis.com/auth/plus.me",
			"https://www.googleapis.com/auth/calendar.readonly", // You have to select your own scope from here -> https://developers.google.com/identity/protocols/googlescopes#google_sign-in
		},
		Endpoint: google.Endpoint,
	}
	return c
}

// OAuthHandler deals with the first part of Oauth
func OAuthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	url := conf.AuthCodeURL(oauthStateString)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// AuthRedirectHandler deals with a successful redirect
func AuthRedirectHandler(w http.ResponseWriter, r *http.Request) *AppError {
	state := r.FormValue("state")
	if state != oauthStateString {
		fmt.Printf("invalid oauth state, expected '%s', got '%s'\n", oauthStateString, state)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return nil
	}

	code := r.FormValue("code")
	token, err := conf.Exchange(oauth2.NoContext, code)
	if err != nil {
		fmt.Printf("oauthConf.Exchange() failed with '%s'\n", err)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return nil
	}

	client := conf.Client(oauth2.NoContext, token)
	service, err := plus.New(client)
	if err != nil {
		m := "Current user not connected"
		return &AppError{errors.New(m), m, 401}
	}

	// Get a list of people that this user has shared with this app
	people := service.People.Get("me")
	me, err := people.Do()
	if err != nil {
		m := "Failed to refresh access token"
		if err.Error() == "AccessTokenRefreshError" {
			return &AppError{errors.New(m), m, 500}
		}
		return &AppError{err, m, 500}
	}
	// fmt.Printf("emails: %s\n", me.Emails[0].Value)

	w.Header().Set("Content-type", "application/json")
	err = json.NewEncoder(w).Encode(&me)
	if err != nil {
		return &AppError{err, "Convert PeopleFeed to JSON", 500}
	}
	return nil
}
