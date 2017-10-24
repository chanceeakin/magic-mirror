// Package graphql starwars provides a example schema and resolver based on Star Wars characters.
//
// Source: https://github.com/graphql/graphql.github.io/blob/source/site/_core/swapiSchema.js
package graphql

import (
	graphql "github.com/neelance/graphql-go"
)

// user struct. matches graphql type User.
type user struct {
	ID       graphql.ID
	username string
	password string
	email    string
}

type calendar struct {
	time    float64
	summary string
}

var mockCalendar = calendar{
	time:    5353432,
	summary: "test",
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

func (r *Resolver) Calendar() *calendarResolver {
	e := &mockCalendar
	return &calendarResolver{e}
}

// User is more robust test query that looks through the slice for available users.
func (r *Resolver) User(args struct{ ID graphql.ID }) *userResolver {
	if u := userData[args.ID]; u != nil {
		return &userResolver{u}
	}
	return nil
}

type calendarResolver struct {
	c *calendar
}

func (r *calendarResolver) Time() float64 {
	return r.c.time
}

func (r *calendarResolver) Summary() string {
	return r.c.summary
}

type userResolver struct {
	u *user
}

func (r *userResolver) ID() graphql.ID {
	return r.u.ID
}

func (r *userResolver) Username() string {
	return r.u.username
}

func (r *userResolver) Email() string {
	return r.u.email
}

func (r *userResolver) Password() string {
	return r.u.password
}
