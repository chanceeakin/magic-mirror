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
	http.Handle("/graphql", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write(gql.Page)
	}))

	http.Handle("/query", &relay.Handler{Schema: schema})
	http.Handle("/", http.FileServer(http.Dir("./../client/build/")))
	fmt.Println("listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
