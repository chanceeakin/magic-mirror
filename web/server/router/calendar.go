package router

import (
	"encoding/json"
	"fmt"
	calendar "github.com/chanceeakin/magic-mirror/web/server/calendar"
	"net/http"
)

func CalendarHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Print("WHAT WHAT WHAT")
	if r.Method != "GET" {
		fmt.Print("HEY")
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	values := calendar.Init()

	if values == nil {
		val := string(`Not Found`)
		jsonVal, _ := json.Marshal(val)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		//Write json response back to response
		w.Write(jsonVal)
		return
	}

	jsonVal, err := json.Marshal(values)
	fmt.Print(values)
	if err != nil {
		panic(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	//Write json response back to response
	w.Write(jsonVal)
}
