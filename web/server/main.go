package main

import (
	"fmt"
	router "github.com/chanceeakin/magic-mirror/web/server/router"
	"log"
)

func main() {
	r := router.NewRouter()
	fmt.Println("Magic Mirror Golang Server running")
	fmt.Println("and listening on :8000")
	log.Fatal(r.ListenAndServe())
}
