package graphql

// Schema is the graphql schema in string form.
var Schema = `
	schema {
		query: Query
	}
	type Query {
		hello: String!
		calendar(calID: String!): Calendar
		calendarList: CalendarList
	}
	type Calendar {
		title: String!
		timezone: String!
		items: [Event]
	}
	type CalendarList {
		listItems: [CalendarListEntry]
	}
	type Event {
		summary: String!
		location: String!
		start: EventDateTime!
		end: EventDateTime!
	}
	type EventDateTime {
		date: String!
		dateTime: String!
		TimeZone: String!
	}
	type CalendarListEntry {
		summary: String!
		TimeZone: String!
		Primary: Boolean!
		id: String!
	}
`

//
// type Calendar {
// 	events: [Event]
// }
// type Event {
// 	id: ID!
// 	time: Float!
// 	summary: String!
// }
