package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

func NewRouter() *mux.Router {
	r := mux.NewRouter().StrictSlash(true)
	for _, route := range routes {
		var handler http.Handler
		handler = route.HandlerFunc
		handler = Logger(handler, route.Name)

		r.
			Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(handler)

	}
	r.PathPrefix("/graphiql").Handler(http.FileServer(http.Dir("static")))
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./../../client/build/")))
	http.Handle("/", r)
	return r
}
