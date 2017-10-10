package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/qor/auth"
	"github.com/qor/auth/auth_identity"
	"github.com/qor/auth/providers/google"
	"github.com/qor/auth/providers/password"
	"github.com/qor/session/manager"

	"net/http"
)

var (
	// Initialize gorm DB
	gormDB, _ = gorm.Open("mysql", "golangTest:thisisatest@/golangtest")

	// Initialize Auth with configuration
	Auth = auth.New(&auth.Config{
		DB: gormDB,
	})
)

func init() {
	// Migrate AuthIdentity model, AuthIdentity will be used to save auth info, like username/password, oauth token, you could change that.
	gormDB.AutoMigrate(&auth_identity.AuthIdentity{})

	// Register Auth providers
	// Allow use username/password
	Auth.RegisterProvider(password.New(&password.Config{}))
	// Allow use Google
	Auth.RegisterProvider(google.New(&google.Config{
		ClientID:     "google client id",
		ClientSecret: "google client secret",
	}))
}

func main() {
	mux := http.NewServeMux()

	// Mount Auth to Router
	mux.Handle("/auth/", Auth.NewServeMux())
	http.ListenAndServe(":8000", manager.SessionManager.Middleware(mux))
}
