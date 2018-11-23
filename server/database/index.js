import dotenv from "dotenv";
import { Pool } from "pg";
import dbConfig from "../config/database";
//load env variables
dotenv.config();
//configurate the environment
const env = process.env.NODE_ENV || "development";

//insipired by olawalejarvis from https://github.com/olawalejarvis/reflection_app_server/blob/develop/src/usingDB/db/index.js
const query = (text, params) => {
  const pool = new Pool({
    connectionString: dbConfig[env]
  });
  return new Promise((resolve, reject) => {
    pool
      .query(text, params)
      .then(response => {
        const { rows } = response;
        resolve(rows);
        pool.end();
      })
      .catch(err => {
        // console.log(err);
        reject(err);
        pool.end();
      });
  });
};
const findById = (table, id) => {
  const pool = new Pool({
    connectionString: dbConfig[env]
  });
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
        pool.end();
      })
      .catch(err => {
        //console.log(err);
        reject(err);
        pool.end();
      });
  });
};

const createTable = migrationText => {
  const pool = new Pool({
    connectionString: dbConfig[env]
  });
  return new Promise((resolve, reject) => {
    pool
      .query(migrationText)
      .then(response => {
        resolve(response);
        pool.end();
      })
      .catch(err => {
        reject(err);
        pool.end();
      });
  });
};

export default { query, createTable, findById };
