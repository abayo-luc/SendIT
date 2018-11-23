import dotenv from "dotenv";

dotenv.config();

export default {
  development: process.env.DEV_DB_URL,
  test: process.env.TEST_DB_URL,
  production: {
    user: process.env.User,
    host: process.env.Host,
    database: process.env.Database,
    port: process.env.Port,
    password: process.env.Password
  }
};
