import { Router } from 'express';
import { findUserParcels } from '../../../controllers/user';

const router = Router();

// post new user
router.post('/users', (req, res) => {
  res.json({ msg: 'post user' });
});

// user parcles
router.get('/users/:id/parcels', findUserParcels);
// user login
router.post('/login', (req, res) => {
  res.json({ msg: 'user login' });
});
export default router;
