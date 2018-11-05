import express from 'express';
// bring parcel model
import Parcel from '../../../data/parcels';

const router = express.Router();

router.get('/parcels', (req, res) => {
  res.json({ msg: 'all parcels', parcels: [...Parcel] });
});

export default router;
