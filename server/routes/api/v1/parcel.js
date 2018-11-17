import express from 'express';
// bring parcel model
import {
  findAll,
  findById,
  createParcel,
  updateParcel,
  cancelParcel,
} from '../../../controllers/parcel';

const router = express.Router();

router.get('/parcels', findAll);
router.get('/parcels/:id', findById);
router.post('/parcels', createParcel);
router.put('/parcels/:id', updateParcel);
router.put('/parcels/:id/cancel', cancelParcel);
export default router;
