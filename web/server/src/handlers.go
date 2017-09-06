package main

import (
	"fmt"
	"net/http"
)

func GraphQL(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "GraphQL!")
}
