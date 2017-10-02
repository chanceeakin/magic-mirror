package main

import (
	"fmt"
	"log"
	"net/http"

	gql "github.com/chanceeakin/magic-mirror/web/server/graphql"
	"github.com/neelance/graphql-go"
	"github.com/neelance/graphql-go/relay"
)

var schema *graphql.Schema

func init() {
	schema = graphql.MustParseSchema(gql.Schema, &gql.Resolver{})
}

func main() {
	http.Handle("/graphiql", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write(gql.Page)
	}))

	http.Handle("/graphql", &relay.Handler{Schema: schema})
	http.Handle("/", http.FileServer(http.Dir("./../client/build/")))
	fmt.Println("listening on :8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
