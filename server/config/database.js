import dotenv from "dotenv";

dotenv.config();

export default {
  development: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    password: process.env.USER_PASSWORD
  },
  test: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.TEST_DB_NAME,
    port: process.env.DB_PORT,
    password: process.env.USER_PASSWORD
  }
};
