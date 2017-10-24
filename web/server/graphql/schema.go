package graphql

// Schema is the graphql schema in text form.
var Schema = `
	schema {
		query: Query
	}
	type Query {
		hello: String!
		user(id: ID!): User
		calendar: Calendar
	}
	type User {
		id: ID!
		username: String!
		email: String!
		password: String!
	}
	type Calendar {
		time: Float!
		summary: String!
	}
`
