import dotenv from "dotenv";

dotenv.config();

export default {
  development: process.env.DEV_DB_URL,
  test: process.env.TEST_DB_URL,
  production: process.env.DATABASE_URL
};
