import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import path from "path";
//bring passport configuraiton
import passportConfig from "./middlewares/passport";
// load all routes
import routers from "./routes/api/v1";
dotenv.config();
const app = express();

//passport configuration
app.use(passport.initialize());
passportConfig(passport);

// configuration middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//load static pages html and cess
app.use(express.static(path.join(__dirname, "../UI")));
// root route, welcome
app.get("/api/v1", (req, res) => {
  res.json({ message: "Welcome to sendIT API" });
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../UI/index.html"));
});
// use all other routes
app.use("/api/v1/", routers);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
// exposing the sever for testing
export default app;
