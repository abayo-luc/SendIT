import { STATUS_CANCELED } from '../utils/types';
import Parcel from '../data/Parcel';
// bring in validator
import { createParcelValidator } from '../validations/parcelsValidations';

export const findAll = (req, res) => {
  const parcels = new Parcel().findAll();
  res.json({ msg: 'all parcels', parcels });
};

export const findById = (req, res) => {
  new Parcel()
    .find(req.params.id)
    .then(parcel => res.json({ msg: 'parcel found', parcel }))
    .catch(err => res.status(404).send({ msg: 'parcel not found' }));
};

export const createParcel = (req, res) => {
  const { isValid, errors } = createParcelValidator(req.body);
  if (!isValid) {
    return res.status(400).send({ msg: 'parcel create failed', errors });
  }
  const newParcel = new Parcel({
    ...req.body
  });
  newParcel
    .save()
    .then(parcel => res.json({ msg: 'Parcel created', parcel }))
    .catch((err) => {
      errors.server = 'There was an internal server error';
      return res.status(500).send({ msg: 'parcel create failed', errors });
    });
};

export const updateParcel = (req, res) => {
  const errors = {};
  const newParcel = new Parcel();
  const parcelAttr = {
    ...req.body
  };

  newParcel
    .update(req.params.id, parcelAttr)
    .then(parcel => res.json({ msg: 'Purcel updated', parcel }))
    .catch((err) => {
      errors.server = 'Parcel not found';
      res.status(404).send({ msg: 'parcel update failed', errors });
    });
};

export const cancelParcel = (req, res) => {
  const errors = {};
  const canceledParcel = new Parcel();
  canceledParcel
    .update(req.params.id, { status: STATUS_CANCELED })
    .then(parcel => res.json({ msg: 'Parcel order canceled', parcel }))
    .catch((err) => {
      errors.parcel = 'Parcel not found';
      res.status(404).send({ msg: 'cancel parcel order failed', errors });
    });
};
