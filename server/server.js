import dotenv from "dotenv";
import express from "express";
import passport from "passport";

//bring passport configuraiton
import passportConfig from "./config/passport";
// load all routes
import routers from "./routes/api/v1";
dotenv.config();
const app = express();

//passport configuration
app.use(passport.initialize());
passportConfig(passport);

// configuration middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// root route, welcome
app.get("/api/v1", (req, res) => {
  res.json({ msg: "Welcome to sendIT API" });
});
// use all other routes
app.use("/api/v1/", routers);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
// exposing the sever for testing
export default app;
