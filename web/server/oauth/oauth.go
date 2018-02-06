package oauth

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/user"
	"path/filepath"
	"regexp"
	"time"
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

// Config is the configuration object for the OAuth 2 protocol.
var Config *oauth2.Config

func init() {
	var c credentials
	secrets, err := ioutil.ReadFile("./keys/plus_client_secret.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}
	json.Unmarshal(secrets, &c)
	os.Setenv("googlekey", c.Cid)
	os.Setenv("googlesecret", c.Csecret)
	Config = configInit()
}

// OauthStateString is a randomly generated token.
var OauthStateString = RandToken(32)

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

// GetClient uses a Context and Config to retrieve a Token
// then generate a Client. It returns the generated Client.
func GetClient(ctx context.Context, Config *oauth2.Config, name string) *http.Client {
	cacheFile, err := TokenCacheFile(name)
	if err != nil {
		log.Fatalf("Unable to get path to cached credential file. %v", err)
	}
	tok, err := tokenFromFile(cacheFile)
	if err != nil {
		tok, err = GetTokenFromWeb(Config)
		if err != nil {
			return nil
		}
		SaveToken(cacheFile, tok)
	}
	return Config.Client(ctx, tok)
}

// GetTokenFromWeb uses Config to request a Token.
// It returns the retrieved Token.
// TODO build the functionality of token saving into the existing oauth connection in oauth/oauth.go
func GetTokenFromWeb(Config *oauth2.Config) (*oauth2.Token, error) {
	authURL := Config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	fmt.Printf("Go to the following link in your browser then type the "+
		"authorization code: \n%v\n", authURL)

	moveOn := make(chan bool)

	go func() {
		time.Sleep(time.Second * 30)
		moveOn <- true
	}()

	select {
	case <-moveOn:
		return nil, errors.New("Looks like you didn't move fast enough")
	case <-time.After(time.Second * 31):
		fmt.Print("This code will never be touched")
	}

	var code string
	if _, err := fmt.Scan(&code); err != nil {
		log.Fatalf("Unable to read authorization code %v", err)
	}

	tok, err := Config.Exchange(oauth2.NoContext, code)
	if err != nil {
		return nil, fmt.Errorf("Unable to retrieve token from web %s", err)
	}
	return tok, nil
}

// TokenCacheFile generates credential file path/filename.
// It returns the generated credential path/filename.
func TokenCacheFile(name string) (string, error) {
	match, _ := regexp.MatchString("([a-zA-Z])", name)
	var fileName string
	fileName = "magic-mirror-creds-" + name + ".json"
	if match != true {
		fileName = "bad-user.json"
	}
	usr, err := user.Current()
	if err != nil {
		return "", err
	}
	tokenCacheDir := filepath.Join(usr.HomeDir, ".credentials")
	os.MkdirAll(tokenCacheDir, 0700)

	return filepath.Join(tokenCacheDir,
		url.QueryEscape(fileName)), err
}

// tokenFromFile retrieves a Token from a given file path.
// It returns the retrieved Token and any read error encountered.
func tokenFromFile(file string) (*oauth2.Token, error) {
	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}
	t := &oauth2.Token{}
	err = json.NewDecoder(f).Decode(t)
	defer f.Close()
	return t, err
}

// SaveToken uses a file path to create a file and store the
// token in it.
func SaveToken(file string, token *oauth2.Token) {
	fmt.Printf("Saving credential file to: %s\n", file)
	f, err := os.OpenFile(file, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0600)
	if err != nil {
		log.Fatalf("Unable to cache oauth token: %v", err)
	}
	defer f.Close()
	json.NewEncoder(f).Encode(token)
}
