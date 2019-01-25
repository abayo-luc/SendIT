import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import path from "path";

//bring swagger api
import swagger from "swagger-ui-express";
import swagerDoc from "./swagger.json";
//bring passport configuraiton
import passportConfig from "./middlewares/passport";
// load all routes
import routers from "./routes/api/v1";
//bring in the pages
import pages from "./routes/pages";
dotenv.config();
const app = express();

//passport configuration
app.use(passport.initialize());
passportConfig(passport);

// configuration middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
      );
      return res.status(200).json({});
    }
    next();
  });
//load static pages html and cess
app.use(express.static(path.join(__dirname, "../UI")));
//API documentation
app.use("/api-docs", swagger.serve, swagger.setup(swagerDoc));
// root route, welcome
app.get("/api/v1", (req, res) => {
  res.json({ message: "Welcome to sendIT API" });
});
//app pages
app.use("/", pages);
// use all other routes
app.use("/api/v1/", routers);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
// exposing the sever for testing
export default app;
