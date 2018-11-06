import express from 'express';
import bodyParser from 'body-parser';
// load all routes
import routers from './routes/api/v1';

const app = express();
// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use all routers
app.use('/api/v1/', routers);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    `Server started on ${port}, visit Visit: http://localhost:${port}`
  );
});

// exposing the sever for testing
export default app;