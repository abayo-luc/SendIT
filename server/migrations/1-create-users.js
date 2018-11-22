import db from "../database";
const migrationText = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_admin BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP
    )`;
(() => {
  db.createTable(migrationText)
    .then(response => console.log(response))
    .catch(err => {
      console.log(err);
    });
})();
