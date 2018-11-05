import express from 'express';

const app = express();

app.use('/', (req, res) => {
  res.json({ msg: 'Hello world' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
