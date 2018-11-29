import { Router } from "express";
import passport from "passport";
// bring parcel model
import parcel from "../../../controllers/parcel";
//validation and authorization
import authorization from "../../../middlewares/authorization";
import validation from "../../../middlewares/validations";
const parcelRouters = Router();
parcelRouters.use(
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/api/v1/unthorized"
  })
);
parcelRouters
  .get("/parcels", authorization.admin, parcel.findAll)
  .get("/parcels/:id", validation.checkId, parcel.findById)
  .post("/parcels", validation.parcel, parcel.create)
  .put(
    "/parcels/:id/destination",
    validation.checkId,
    parcel.update
  )
  .put(
    "/parcels/:id/cancel",
    validation.checkId,
    parcel.cancel
  )
  .put(
    "/parcels/:id/status",
    validation.checkId,
    authorization.admin,
    parcel.changeStatus
  )
  .put(
    "/parcels/:id/presentLocation",
    validation.checkId,
    validation.checkCurrentLocation,
    parcel.presentLocation
  );
export default parcelRouters;
