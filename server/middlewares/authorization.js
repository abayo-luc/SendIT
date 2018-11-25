import httpResponses from "../utils/httpResponses";

export default class {
  static authorizeAdmin(req, res, next) {
    const { is_admin } = req.user;
    is_admin
      ? next()
      : httpResponses.bad(res, 401, "failed", "Unthorized");
  }
  static authorizeUser(req, res, next) {
    if (!Number(req.params.id)) {
      return httpResponses.bad(
        res,
        400,
        "failed",
        "Invalid id"
      );
    }
    req.user.id == req.params.id || req.user.is_admin
      ? next()
      : httpResponses.bad(res, 401, "failed", "Unthorized");
  }
}
