import {
  STATUS_CANCELED,
  STATUS_INTRANSIT
} from "../utils/types";
import parcel from "../data/Parcel";
// bring in validator
import { createParcelValidator } from "../validations/parcelsValidations";
import {
  okResponse,
  badResponse
} from "../utils/httpResponses";
// new parce instance from parcel model
const parcelInstance = new parcel();
export default class Parcel {
  static findAll(req, res) {
    const parcels = parcelInstance.findAll();
    okResponse(res, 200, "parcels", parcels);
  }

  static findById(req, res) {
    parcelInstance
      .find(req.params.id)
      .then(parcel => {
        if (!parcel) {
          return badResponse(res, 404, "Parcel not found");
        }
        return okResponse(res, 200, "parcel", parcel);
      })
      .catch(err =>
        badResponse(
          res,
          500,
          "Unknown internal server error"
        )
      );
  }

  static create(req, res) {
    const { isValid, errors } = createParcelValidator(
      req.body
    );
    if (!isValid) {
      return badResponse(res, 400, "failed", errors);
    }
    const newParcel = {
      ...req.body,
      userId: req.body.userId || 1,
      status: STATUS_INTRANSIT
    };
    parcelInstance
      .save(newParcel)
      .then(parcel =>
        okResponse(res, 201, "parcel", parcel, "success")
      )
      .catch(err =>
        badResponse(res, 500, "Internal server error", err)
      );
  }
  //update parcel
  static update(req, res) {
    return parcelUpdater(res, req.params.id, req.body);
  }

  //cancel parcel by updating its status
  static cancel(req, res) {
    return parcelUpdater(res, req.params.id, {
      status: STATUS_CANCELED
    });
  }
}

// function to update any attribute of parcel
const parcelUpdater = (res, id, attrs = {}) => {
  parcelInstance
    .update(id, attrs)
    .then(parcel => {
      if (!parcel) {
        return badResponse(res, 404, "Parcel not found");
      }
      okResponse(res, 201, "parcel", parcel, "success");
    })
    .catch(err =>
      badResponse(res, 500, "Intern server error", err)
    );
};
