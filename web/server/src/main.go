package main

import (
	"fmt"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("../../client/build/"))
	http.Handle("/", fs)
	fmt.Println("Listening on 8080")
	http.ListenAndServe(":8080", nil)
}
