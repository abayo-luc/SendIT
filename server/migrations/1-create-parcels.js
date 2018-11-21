import db from "../database";
const migrationText = `CREATE TABLE IF NOT EXISTS
      parcels(
        id UUID PRIMARY KEY,
        pickup_location TEXT NOT NULL,
        destination TEXT NOT NULL,
        address JSONB,
        details JSONB NOT NULL,
        current_location TEXT,
        status TEXT NOT NULL DEFAULT 'in_transit',
        user_id UUID NOT NULL REFERENCES users (id),
        created_at TIMESTAMP
    )`;
(() => {
  db.createTable(migrationText)
    .then(response => console.log(response))
    .catch(err => {
      console.log(err);
    });
})();
