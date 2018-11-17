import {
  STATUS_CANCELED,
  STATUS_INTRANSIT
} from "../utils/types";
import Parcel from "../data/Parcel";
// bring in validator
import { createParcelValidator } from "../validations/parcelsValidations";

// new parce instance
const parcelInstance = new Parcel();
export const findAll = (req, res) => {
  const parcels = parcelInstance.findAll();
  res.json({ msg: "all parcels", parcels });
};

export const findById = (req, res) => {
  parcelInstance
    .find(req.params.id)
    .then(parcel =>
      res.json({ msg: "parcel found", parcel })
    )
    .catch(err =>
      res.status(404).send({ msg: "parcel not found" })
    );
};

export const createParcel = (req, res) => {
  const { isValid, errors } = createParcelValidator(
    req.body
  );
  if (!isValid) {
    return res
      .status(400)
      .send({ msg: "parcel create failed", errors });
  }
  const newParcel = {
    ...req.body,
    userId: req.body.userId || 1,
    status: STATUS_INTRANSIT
  };
  parcelInstance
    .save(newParcel)
    .then(parcel =>
      res
        .status(201)
        .json({ msg: "Parcel created", parcel })
    )
    .catch(err => {
      errors.server = "There was an internal server error";
      return res
        .status(500)
        .send({ msg: "parcel create failed", errors });
    });
};

export const updateParcel = (req, res) => {
  const errors = {};
  const parcelAttr = {
    ...req.body
  };

  parcelInstance
    .update(req.params.id, parcelAttr)
    .then(parcel =>
      res.json({ msg: "Purcel updated", parcel })
    )
    .catch(err => {
      errors.server = "Parcel not found";
      res
        .status(404)
        .send({ msg: "parcel update failed", errors });
    });
};

export const cancelParcel = (req, res) => {
  const errors = {};
  parcelInstance
    .update(req.params.id, { status: STATUS_CANCELED })
    .then(parcel =>
      res.json({ msg: "Parcel order canceled", parcel })
    )
    .catch(err => {
      errors.parcel = "Parcel not found";
      res.status(404).send({
        msg: "cancel parcel order failed",
        errors
      });
    });
};
