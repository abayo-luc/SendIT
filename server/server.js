import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// load all routes
import routers from './routes/api/v1';

const app = express();
// configuration middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use all routers
app.get('/api/v1', (req, res) => {
  res.json({ msg: 'Welcome to sendIT API' });
});
app.use('/api/v1/', routers);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

// exposing the sever for testing
export default app;
