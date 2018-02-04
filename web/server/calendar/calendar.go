// Package calendar contains google calendar oauth interactions.
package calendar

import (
	"io/ioutil"
	"log"
	"time"

	customOAuth "github.com/chanceeakin/magic-mirror/web/server/oauth"
	"golang.org/x/net/context"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
)

// CalFunc takes the place of main.
func CalFunc(calID string) *calendar.Events {
	ctx := context.Background()

	b, err := ioutil.ReadFile("./keys/calendar_secret.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}

	// If modifying these scopes, delete your previously saved credentials
	// at ~/.credentials/calendar-go-quickstart.json
	config, err := google.ConfigFromJSON(b, calendar.CalendarReadonlyScope)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
	}
	name := "chance.eakin@gmail.com"
	client := customOAuth.GetClient(ctx, config, name)

	srv, err := calendar.New(client)
	if err != nil {
		log.Fatalf("Unable to retrieve calendar Client %v", err)
	}

	t := time.Now()
	maxT := t.AddDate(0, 0, 1)
	events, err := srv.Events.List(calID).ShowDeleted(false).
		SingleEvents(true).TimeMin(t.Format(time.RFC3339)).TimeMax(maxT.Format(time.RFC3339)).MaxResults(10).OrderBy("startTime").Do()
	if err != nil {
		log.Fatalf("Unable to retrieve next ten of the user's events. %v", err)
	}

	if len(events.Items) > 0 {
		return events
	}
	return nil
}

// GetCalendars grabs a users' calendars
func GetCalendars(name string) *calendar.CalendarList {
	ctx := context.Background()

	b, err := ioutil.ReadFile("./keys/calendar_secret.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}

	// If modifying these scopes, delete your previously saved credentials
	// at ~/.credentials/calendar-go-quickstart.json
	config, err := google.ConfigFromJSON(b, calendar.CalendarReadonlyScope)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
	}
	client := customOAuth.GetClient(ctx, config, name)

	srv, err := calendar.New(client)
	if err != nil {
		log.Fatalf("Unable to retrieve calendar Client %v", err)
	}

	listRes, err := srv.CalendarList.List().Fields("items").Do()
	if err != nil {
		log.Fatalf("Unable to retrieve list of calendars: %v", err)
	}
	if len(listRes.Items) > 0 {
		return listRes
	}
	return nil
}
