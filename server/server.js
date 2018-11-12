import express from 'express';
// load all routes
import routers from './routes/api/v1';

const app = express();
// body-parser middleware
app.use(express.json());
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
