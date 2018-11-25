import validatorHelpers from "../validations/validators";
import httpResponses from "../utils/httpResponses";
import { isEmpty } from "../utils/validatorHelpers";
export default class {
  static signup(req, res, next) {
    const {
      isValid,
      errors
    } = validatorHelpers.checkPresence(req.body, [
      "email",
      "password",
      "firstName",
      "lastName",
      "password"
    ]);
    isValid
      ? next()
      : httpResponses.bad(
          res,
          400,
          "failed",
          "Invalid inputs",
          errors
        );
  }

  static login(req, res, next) {
    const {
      isValid,
      errors
    } = validatorHelpers.checkPresence(req.body, [
      "email",
      "password"
    ]);

    isValid
      ? next()
      : httpResponses.bad(res, 400, "failed", null, errors);
  }
  static parcel(req, res, next) {
    const {
      isValid,
      errors
    } = validatorHelpers.checkPresence(req.body, [
      "pickupLocation",
      "destination",
      "weight",
      "quantity"
    ]);

    isValid
      ? next()
      : httpResponses.bad(res, 400, "failed", null, errors);
  }

  static checkId(req, res, next) {
    const { id } = req.params;
    Number(id)
      ? next()
      : httpResponses.bad(res, 400, "failed", "Invalid id");
  }

  static checkCurrentLocation(req, res, next) {
    const isLocationPresent =
      !isEmpty(req.body.currentLocation) ||
      !isEmpty(req.body.presentLocation);
    isLocationPresent
      ? next()
      : httpResponses.bad(res, 400, "failed", null, {
          presentLocation: "presentLocation is required"
        });
  }
}
