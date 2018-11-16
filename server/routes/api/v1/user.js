import { Router } from 'express';
import { findUserParcels, createUser, authenticateUser } from '../../../controllers/user';

const router = Router();

// post new user
router.post('/users', createUser);
// user parcles
router.get('/users/:id/parcels', findUserParcels);
// user login
router.post('/login', authenticateUser);
export default router;
