// Package graphql contains the graphql resolvers.
package graphql

import (
	cal "github.com/chanceeakin/magic-mirror/web/server/calendar"
	google "google.golang.org/api/calendar/v3"
)

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

// ListResolver resolves lists of calendars!
type ListResolver struct {
	l *google.CalendarList
}

// ListEntryResolver resolves list entries.
type ListEntryResolver struct {
	s *google.CalendarListEntry
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

// Start returns start times for events
func (r *EventResolver) Start() *EventDateTimeResolver {
	return &EventDateTimeResolver{r.e.Start}
}

// End gives you the end time for a particular event.
func (r *EventResolver) End() *EventDateTimeResolver {
	return &EventDateTimeResolver{r.e.End}
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

// Calendar is the endpoint for your daily calendar delivery
func (r *Resolver) Calendar(args struct{ CalID string }) *CalendarResolver {
	if c := cal.CalFunc(args.CalID); c != nil {
		return &CalendarResolver{c}
	}
	return nil
}

// CalendarList returns a list of calendars
func (r *Resolver) CalendarList() *ListResolver {
	if l := cal.GetCalendars("Chance"); l != nil {
		return &ListResolver{l}
	}
	return nil
}

// ListItems lists the items in the calendar list. Holy crap that's a lot of redundant words.
func (r *ListResolver) ListItems() *[]*ListEntryResolver {
	var l []*ListEntryResolver
	for _, summ := range r.l.Items {
		l = append(l, &ListEntryResolver{summ})
	}
	return &l
}

// Summary returns the name of the calendar list entry
func (r *ListEntryResolver) Summary() string {
	return r.s.Summary
}

// TimeZone returns the calendar list entry's timezone
func (r *ListEntryResolver) TimeZone() string {
	return r.s.TimeZone
}

// Primary returns whether the selected calendar is primary or not.
func (r *ListEntryResolver) Primary() bool {
	return r.s.Primary
}

// ID returns the calendar's ID!
func (r *ListEntryResolver) ID() string {
	return r.s.Id
}
