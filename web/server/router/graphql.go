package router

import (
	gql "github.com/chanceeakin/magic-mirror/web/server/graphql"
	"net/http"
)

func graphIQL(w http.ResponseWriter, r *http.Request) {
	w.Write(gql.Page)
}
