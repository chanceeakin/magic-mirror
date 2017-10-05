package router

import (
	gql "github.com/chanceeakin/magic-mirror/web/server/graphql"
	"github.com/gorilla/mux"
	"github.com/neelance/graphql-go"
	"github.com/neelance/graphql-go/relay"
	"net/http"
	"time"
)

var schema *graphql.Schema

func init() {
	schema = graphql.MustParseSchema(gql.Schema, &gql.Resolver{})
}

// NewRouter creates the mux router!
func NewRouter() *http.Server {

	router := mux.NewRouter()
	router.HandleFunc("/graphiql", graphIQL)
	router.HandleFunc("/api/signup", Signup)
	router.HandleFunc("/api/login", Login)
	router.Handle("/graphql", &relay.Handler{Schema: schema})

	srv := &http.Server{
		Handler: router,
		Addr:    "127.0.0.1:8000",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	return srv
}
