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
    database: process.env.TEST_DB_NAME || "send_it_test",
    port: process.env.DB_PORT,
    password: process.env.USER_PASSWORD
  },
  production: {
    user: process.env.User,
    host: process.env.Host,
    database: process.env.Database,
    port: process.env.Port,
    password: process.env.Password
  }
};
