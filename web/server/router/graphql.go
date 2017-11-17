package router

import (
	"fmt"
	gql "github.com/chanceeakin/magic-mirror/web/server/graphql"
	"net/http"
)

func graphIQL(w http.ResponseWriter, r *http.Request) {
	fmt.Print("hey, graphql page is hit")
	w.Write(gql.Page)
}
