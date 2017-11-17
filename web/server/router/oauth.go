package router

import (
	// "fmt"
	oauth "github.com/chanceeakin/magic-mirror/web/server/oauth"
	"net/http"
)

func AuthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	v := oauth.OAuthFunc
	v()

	w.Write([]byte("authentication"))
}
