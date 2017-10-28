// Package graphql starwars provides a example schema and resolver based on Star Wars characters.
//
// Source: https://github.com/graphql/graphql.github.io/blob/source/site/_core/swapiSchema.js
package graphql

import (
	cal "github.com/chanceeakin/magic-mirror/web/server/calendar"
	graphql "github.com/neelance/graphql-go"
	google "google.golang.org/api/calendar/v3"
)

// user struct. matches graphql type User.
type user struct {
	ID       graphql.ID
	username string
	password string
	email    string
}

// mock data.
var users = []*user{
	{
		ID:       "1",
		username: "Chance",
		password: "shhh",
		email:    "fake@fakeyfake.com",
	},
}

type event struct {
	summary  string
	start    float64
	calendar string
}

type calendar struct {
	events []*event
}

// create a slice of users in memory
var userData = make(map[graphql.ID]*user)

// populate the slice
func init() {
	for _, u := range users {
		userData[u.ID] = u
	}
}

// Resolver is the bare resolver struct.
type Resolver struct{}

// Hello is a test query.
func (r *Resolver) Hello() string {
	return "Hello world!"
}

// CalendarResolver is the resolver struct for the calendar function.
type CalendarResolver struct {
	c *google.Events
}

// EventResolver resolves events!
type EventResolver struct {
	e *google.Event
}

// EventDateTimeResolver returns a google date time struct
type EventDateTimeResolver struct {
	d *google.EventDateTime
}

// Title return the calendar title from the calendar Resolver
func (r *CalendarResolver) Title() string {
	return r.c.Summary
}

// TimeZone returns the calendar's timezone
func (r *CalendarResolver) TimeZone() string {
	return r.c.TimeZone
}

// Items returns all of the event elements
func (r *CalendarResolver) Items() *[]*EventResolver {
	var e []*EventResolver
	for _, summ := range r.c.Items {
		e = append(e, &EventResolver{summ})
	}
	return &e
}

func (r *EventResolver) Start() *EventDateTimeResolver {
	return &EventDateTimeResolver{r.e.Start}
}

// Summary returns the summary of the event
func (r *EventResolver) Summary() string {
	return r.e.Summary
}

// Location returns the location of the event
func (r *EventResolver) Location() string {
	return r.e.Location
}

// Date returns the date for an EventDateTimeResolver
func (r *EventDateTimeResolver) Date() string {
	return r.d.Date
}

// DateTime returns a datetime string
func (r *EventDateTimeResolver) DateTime() string {
	return r.d.DateTime
}

// TimeZone returns an EventDateTime Timezone
func (r *EventDateTimeResolver) TimeZone() string {
	return r.d.TimeZone
}

// func (r *CalendarResolver) Summary() []*EventResolver {
// 	var e []*EventResolver
// 	for _, summ := range r.c.Items {
// 		e = append(e, &EventResolver{summ})
// 	}
// 	return e
// }

// User is more robust test query that looks through the slice for available users.
func (r *Resolver) User(args struct{ ID graphql.ID }) *UserResolver {
	if u := userData[args.ID]; u != nil {
		return &UserResolver{u}
	}
	return nil
}

// Calendar is the endpoint for your daily calendar delivery
func (r *Resolver) Calendar() *CalendarResolver {
	if c := cal.Init(); c != nil {
		return &CalendarResolver{c}
	}
	// make a slice of whatever the fuck calendar.Events.Items is.
	// then parse that fucker into resolver values.
	// I only give a fuck about the start time, the calendar, and the summary of the events.
	// grab those.
	// put them in this slice.
	// return this slice as resolver funcs.

	return nil
}

// UserResolver is the struct for returning users.
type UserResolver struct {
	u *user
}

// ID is the id resolver.
func (r *UserResolver) ID() graphql.ID {
	return r.u.ID
}

//Username returns usernames
func (r *UserResolver) Username() string {
	return r.u.username
}

// Email returns the email addy.
func (r *UserResolver) Email() string {
	return r.u.email
}

// Password returns a fake password.
func (r *UserResolver) Password() string {
	return r.u.password
}
