package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	router := NewRouter()
	fmt.Println("Listening on 8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
