package main

import (
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
	"log"
	"net/http"
)

func main() {
	fields := graphql.Fields{
		"hello": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return "world, you beautiful thing.", nil
			},
		},
	}
	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: fields}
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery)}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		log.Fatalf("failed to create new schema, error: %v", err)
	}

	// Query
	query := `
		{
			hello
		}
	`
	params := graphql.Params{Schema: schema, RequestString: query}
	r := graphql.Do(params)
	if len(r.Errors) > 0 {
		log.Fatalf("failed to execute graphql operation, errors: %+v", r.Errors)
	}

	// create a graphl-go HTTP handler with our previously defined schema
	// and we also set it to return pretty JSON output
	h := handler.New(&handler.Config{
		Schema: &schema,
		Pretty: true,
	})
	fs := http.FileServer(http.Dir("static"))

	// serve a GraphQL endpoint at `/graphql`
	http.Handle("/graphql", h)
	http.Handle("/", fs)

	// and serve!
	http.ListenAndServe(":3000", nil)
}