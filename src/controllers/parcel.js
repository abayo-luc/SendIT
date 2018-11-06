import { STATUS_CANCELED } from '../utils/types';
import Parcel from '../data/Parcel';

export const findAll = (req, res) => {
  const parcels = new Parcel().findAll();
  res.json({ msg: 'all parcels', parcels });
};

export const findById = (req, res) => {
  new Parcel()
    .find(req.params.id)
    .then(parcel => res.json({ msg: 'parcel found', parcel }))
    .catch(err => res.status(404).send(err));
};

export const createParcel = (req, res) => {
  const newParcel = new Parcel({
    ...req.body
  });
  newParcel
    .save()
    .then(parcel => res.json({ msg: 'Parcel created', parcel }))
    .catch(err => res.status(400).send(err));
  // res.json({ msg: 'Purcel created', parcel });
};

export const updateParcel = (req, res) => {
  const newParcel = new Parcel();
  const parcelAttr = {
    ...req.body
  };

  newParcel
    .update(req.params.id, parcelAttr)
    .then(parcel => res.json({ msg: 'Purcel updated', parcel }))
    .catch(err => res.status(400).send(err));
};

export const cancelParcel = (req, res) => {
  const canceledParcel = new Parcel();
  canceledParcel
    .update(req.params.id, { status: STATUS_CANCELED })
    .then(parcel => res.json({ msg: 'Parcel order canceled', parcel }))
    .catch(err => res.status(400).send(err));
};