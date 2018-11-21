import {
  STATUS_CANCELED,
  STATUS_INTRANSIT
} from "../utils/types";
import uuid from "uuid";
import moment from "moment";
//bring the db
import db from "../database";
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
    const queryText = `SELECT * FROM parcels INNER JOIN users ON parcels.user_id= users.id`;
    db.query(queryText)
      .then(parcels => {
        okResponse(res, 200, "parcels", parcels);
      })
      .catch(err => {
        console.log(err);
        badResponse(req, 500, "Internal error", err);
      });
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
    const queryText = `
    INSERT INTO parcels( 
        id, 
        pickup_location, 
        destination, 
        address, 
        details, 
        current_location, 
        status,
        user_id,
        created_at)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
    returning *
    `;
    let address = {};
    if (req.body.pickupAddress)
      address["pickup_address"] = req.body.pickupAddress;
    if (req.body.destinationAddress)
      address["destination_address"] =
        req.body.destinationAddress;
    const {
      quantity,
      weight,
      height,
      width,
      length
    } = req.body;
    let details = {
      quantity,
      weight,
      height,
      width,
      length
    };
    const currentLocation = req.body.pickupLocation;
    const userId = req.user.id;
    const newParcel = [
      uuid(),
      req.body.pickupLocation,
      req.body.destination,
      address,
      details,
      currentLocation,
      STATUS_INTRANSIT,
      userId,
      moment(new Date())
    ];
    db.query(queryText, newParcel)
      .then(parcelRes => {
        okResponse(
          res,
          201,
          "parcel",
          parcelRes,
          "success"
        );
      })
      .catch(err => {
        badResponse(
          res,
          500,
          "Internal server errror",
          err
        );
      });
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
