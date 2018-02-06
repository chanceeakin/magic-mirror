// Package calendar contains google calendar oauth interactions.
package calendar

import (
	"fmt"
	"io/ioutil"
	"log"
	"time"

	customOAuth "github.com/chanceeakin/magic-mirror/web/server/oauth"
	"golang.org/x/net/context"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
)

// CalFunc takes the place of main.
func CalFunc(email string, calID string) (*calendar.Events, error) {
	ctx := context.Background()

	b, err := ioutil.ReadFile("./keys/old_client_secret.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}

	// If modifying these scopes, delete your previously saved credentials
	// at ~/.credentials/calendar-go-quickstart.json
	config, err := google.ConfigFromJSON(b, calendar.CalendarReadonlyScope)
	if err != nil {
		return nil, fmt.Errorf("Unable to parse client secret file to config: %s", err)
	}
	name := email
	client := customOAuth.GetClient(ctx, config, name)

	srv, err := calendar.New(client)
	if err != nil {
		return nil, fmt.Errorf("Unable to retrieve calendar Client %s", err)
	}

	t := time.Now()
	maxT := t.AddDate(0, 0, 1)
	events, err := srv.Events.List(calID).ShowDeleted(false).
		SingleEvents(true).TimeMin(t.Format(time.RFC3339)).TimeMax(maxT.Format(time.RFC3339)).MaxResults(10).OrderBy("startTime").Do()

	if err != nil {
		return nil, fmt.Errorf("Unable to retrieve next ten of the user's events. %s", err)
	}

	if len(events.Items) > 0 {
		return events, nil
	}
	return nil, nil
}

// GetCalendars grabs a users' calendars
func GetCalendars(name string) (*calendar.CalendarList, error) {
	ctx := context.Background()

	b, err := ioutil.ReadFile("./keys/old_client_secret.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}

	// If modifying these scopes, delete your previously saved credentials
	// at ~/.credentials/calendar-go-quickstart.json
	config, err := google.ConfigFromJSON(b, calendar.CalendarReadonlyScope)
	if err != nil {
		return nil, fmt.Errorf("Unable to parse client secret file to config: %s", err)
	}
	client := customOAuth.GetClient(ctx, config, name)

	srv, err := calendar.New(client)
	if err != nil {
		return nil, fmt.Errorf("Unable to retrieve calendar Client %v", err)
	}

	listRes, err := srv.CalendarList.List().Fields("items").Do()
	if err != nil {
		return nil, fmt.Errorf("Unable to retrieve list of calendars: %s", err)
	}
	if len(listRes.Items) > 0 {
		return listRes, nil
	}
	return nil, nil
}
