import dotenv from "dotenv";
import { Pool } from "pg";
import dbConfig from "../config/database";
//load env variables
dotenv.config();
//configurate the environment
const env = process.env.NODE_ENV || "development";

//connect via pool
const pool = new Pool({
  ...dbConfig[env]
});

//insipired by olawalejarvis from https://github.com/olawalejarvis/reflection_app_server/blob/develop/src/usingDB/db/index.js
const query = (text, params) => {
  return new Promise((resolve, reject) => {
    pool
      .query(text, params)
      .then(response => {
        const { rows } = response;
        resolve(rows);
      })
      .catch(err => {
        // console.log(err);
        reject(err);
      });
  });
};
const findById = (table, id) => {
  const queryText = `
      SELECT *  FROM ${table} WHERE id = $1 LIMIT 1
    `;
  const values = [id];
  return new Promise((resolve, reject) => {
    pool
      .query(queryText, values)
      .then(response => {
        const { rows } = response;
        resolve(rows[0]);
      })
      .catch(err => {
        //console.log(err);
        reject(err);
      });
  });
};

const createTable = migrationText => {
  return new Promise((resolve, reject) => {
    pool
      .query(migrationText)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default { query, createTable, findById };
