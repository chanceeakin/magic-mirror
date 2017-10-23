package main

import (
	"fmt"
	calendar "github.com/chanceeakin/magic-mirror/web/server/calendar"
	router "github.com/chanceeakin/magic-mirror/web/server/router"
	"log"
)

func main() {
	r := router.NewRouter()
	calendar.Init()
	fmt.Println("listening on :8000")
	log.Fatal(r.ListenAndServe())
}
