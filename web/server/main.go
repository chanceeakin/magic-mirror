package main

import (
	"fmt"
	router "github.com/chanceeakin/magic-mirror/web/server/router"
	"log"
)

func main() {
	r := router.NewRouter()
	fmt.Println("listening on :8000")
	log.Fatal(r.ListenAndServe())
}
