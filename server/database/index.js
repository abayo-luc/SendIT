import dotenv from "dotenv";
import { Pool } from "pg";

//load env variables
dotenv.config();

//connect via pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD
});

//insipired by olawalejarvis from https://github.com/olawalejarvis/reflection_app_server/blob/develop/src/usingDB/db/index.js
const query = (text, params) => {
  return new Promise((resolve, reject) => {
    pool
      .query(text, params)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default { query };
