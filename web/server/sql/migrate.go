package sql

// import migrate "github.com/rubenv/sql-migrate"

//
// // Hardcoded strings in memory:
// migrations := &migrate.MemoryMigrationSource{
//     Migrations: []*migrate.Migration{
//         &migrate.Migration{
//             Id:   "123",
//             Up:   []string{"CREATE TABLE people (id int)"},
//             Down: []string{"DROP TABLE people"},
//         },
//     },
// }

// OR: Read migrations from a folder:
// Migrations provides a migration source for database migration
// var Migrations = &migrate.FileMigrationSource{
// 	Dir: "db/migrations",
// }

//
// // OR: Use migrations from bindata:
// migrations := &migrate.AssetMigrationSource{
//     Asset:    Asset,
//     AssetDir: AssetDir,
//     Dir:      "migrations",
// }
