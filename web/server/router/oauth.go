package router

import (
	"fmt"
	"net/http"

	"encoding/json"
	"errors"
	customOAuth "github.com/chanceeakin/magic-mirror/web/server/oauth"
	"golang.org/x/oauth2"
	"google.golang.org/api/plus/v1"
)

// OAuthHandler deals with the first part of Oauth
func OAuthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	url := customOAuth.Config.AuthCodeURL(customOAuth.OauthStateString)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// AuthRedirectHandler deals with a successful redirect
func AuthRedirectHandler(w http.ResponseWriter, r *http.Request) *AppError {
	state := r.FormValue("state")
	if state != customOAuth.OauthStateString {
		fmt.Printf("invalid oauth state, expected '%s', got '%s'\n", customOAuth.OauthStateString, state)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return nil
	}

	code := r.FormValue("code")
	token, err := customOAuth.Config.Exchange(oauth2.NoContext, code)
	if err != nil {
		fmt.Printf("oauthConf.Exchange() failed with '%s'\n", err)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return nil
	}

	client := customOAuth.Config.Client(oauth2.NoContext, token)
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
	fmt.Printf("emails: %s\n", me.Emails[0].Value)

	w.Header().Set("Content-type", "application/json")
	err = json.NewEncoder(w).Encode(&me)
	if err != nil {
		return &AppError{err, "Convert PeopleFeed to JSON", 500}
	}
	return nil
}
