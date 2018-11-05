import express from 'express';
// bring parcel model
import Parcel from '../../../data/parcels';

const router = express.Router();

router.get('/parcel', (req, res) => {
  res.json({ msg: 'all parcel', parcels: [...Parcel] });
});

export default router;
