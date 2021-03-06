package router

import (
	"encoding/json"
	"fmt"
	calendar "github.com/chanceeakin/magic-mirror/web/server/calendar"
	"net/http"
)

// CalendarHandler is an http function for delivering calendar information.
func CalendarHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	fmt.Print(r)
	calID := "primary"
	values, err := calendar.CalFunc("Chance.eakin@gmail.com", calID)
	if err != nil {
		panic(err)
	}
	calendar.GetCalendars("Chance.eakin@gmail.com")

	if values == nil {
		val := map[string]string{"result": "no events found!"}
		jsonVal, _ := json.Marshal(val)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		//Write json response back to response
		w.Write(jsonVal)
		return
	}

	jsonVal, err := json.Marshal(values)
	if err != nil {
		panic(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	//Write json response back to response
	w.Write(jsonVal)
}
