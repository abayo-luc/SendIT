import validatorHelpers from "../validations/validators";
import httpResponses from "../utils/httpResponses";
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
      : httpResponses.badResponse(
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
      : httpResponses.badResponse(
          res,
          400,
          "failed",
          null,
          errors
        );
  }
}
