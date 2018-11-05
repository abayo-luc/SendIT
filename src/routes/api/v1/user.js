import express from 'express';

const router = express.Router();

// post new user
router.post('/users', (req, res) => {
  res.json({ msg: 'post user' });
});
// user login
router.post('/login', (req, res) => {
  res.json({ msg: 'user login' });
});
export default router;
