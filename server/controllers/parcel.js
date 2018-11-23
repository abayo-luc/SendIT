import {
  STATUS_CANCELED,
  STATUS_INTRANSIT
} from "../utils/types";
import moment from "moment";
//bring the db
import db from "../database";
// bring in validator
import { createParcelValidator } from "../validations/parcelsValidations";
import {
  okResponse,
  badResponse
} from "../utils/httpResponses";
import { isEmpty } from "../utils/validatorHelpers";
// new parce instance from parcel model
export default class Parcel {
  static findAll(req, res) {
    const queryText = `SELECT * FROM parcels`;
    db.query(queryText)
      .then(parcels => {
        okResponse(res, 200, "parcels", parcels, "success");
      })
      .catch(err => {
        //console.log(err);
        badResponse(
          req,
          500,
          "failed",
          "Internal error",
          err
        );
      });
  }

  static findById(req, res) {
    db.findById("parcels", parseInt(req.params.id, 10))
      .then(parcel => {
        if (!parcel) {
          return badResponse(
            res,
            404,
            "failed",
            "Parcel not found"
          );
        }
        return okResponse(
          res,
          200,
          "parcel",
          parcel,
          "success"
        );
      })
      .catch(err => {
        badResponse(
          res,
          500,
          "failed",
          "Internal server error",
          err
        );
      });
  }

  static create(req, res) {
    const { isValid, errors } = createParcelValidator(
      req.body
    );
    if (!isValid) {
      return badResponse(res, 400, "failed", null, errors);
    }
    const queryText = `
    INSERT INTO parcels(  
        pickup_location, 
        destination, 
        address, 
        details, 
        current_location, 
        status,
        user_id,
        created_at)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
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
          parcelRes[0],
          "success"
        );
      })
      .catch(err => {
        badResponse(
          res,
          500,
          "failed",
          "Internal server errror",
          err
        );
      });
  }
  //update parcel
  static update(req, res) {
    const parcelQuery =
      "SELECT * FROM parcels WHERE id = $1 AND user_id = $2";
    db.query(parcelQuery, [
      parseInt(req.params.id),
      parseInt(req.user.id)
    ])
      .then(response => {
        const parcel = response[0];
        if (!parcel) {
          return badResponse(
            res,
            404,
            "failed",
            "Parcel not found"
          );
        }

        const updateQuery = `UPDATE parcels SET 
        destination=$1, 
        address=$2 
        WHERE id=$3 AND user_id=$4
        returning *
       `;
        let address = { ...parcel.address };
        if (req.body.destinationAddress)
          address["destination_address"] =
            req.body.destinationAddress;

        const values = [
          req.body.destination || parcel["destination"],
          !isEmpty(address) ? address : parcel.address,
          parseFloat(req.params.id),
          parseFloat(req.user.id)
        ];
        db.query(updateQuery, values)
          .then(response => {
            const updatedParcel = response[0];
            okResponse(
              res,
              201,
              "parcel",
              updatedParcel,
              "success"
            );
          })
          .catch(err => {
            badResponse(
              res,
              500,
              "failed",
              "Intern server error",
              err
            );
          });
      })
      .catch(err => {
        badResponse(
          res,
          500,
          "failed",
          "Intern server error",
          err
        );
      });
  }

  //cancel parcel by updating its status
  static cancel(req, res) {
    const attributes = {
      status: STATUS_CANCELED
    };
    const parcelQuery =
      "SELECT * FROM parcels WHERE id = $1 AND user_id = $2";
    db.query(parcelQuery, [
      parseInt(req.params.id),
      parseInt(req.user.id)
    ])
      .then(response => {
        const parcel = response[0];
        if (!parcel) {
          return badResponse(
            res,
            404,
            "failed",
            "Parcel not found"
          );
        }

        const updateQuery = `UPDATE parcels SET 
        status=$1 
        WHERE id=$2 AND user_id=$3
        returning *`;

        const values = [
          STATUS_CANCELED,
          parseFloat(req.params.id),
          parseFloat(req.user.id)
        ];
        db.query(updateQuery, values)
          .then(response => {
            const updatedParcel = response[0];
            okResponse(
              res,
              201,
              "parcel",
              updatedParcel,
              "success"
            );
          })
          .catch(err => {
            badResponse(
              res,
              500,
              "Intern server error",
              err
            );
          });
      })
      .catch(err => {
        badResponse(
          res,
          500,
          "failed",
          "Intern server error",
          err
        );
      });
  }
}
