import { Router } from "express";
import passport from "passport";
// bring parcel model
import parcel from "../../../controllers/parcel";
//validation and authorization
import authorization from "../../../middlewares/authorization";
const parcelRouters = Router();
parcelRouters.use(
  passport.authenticate("jwt", { session: false })
);
parcelRouters
  .get(
    "/parcels",
    authorization.authorizeAdmin,
    parcel.findAll
  )
  .get(
    "/parcels/:id",
    authorization.authorizeUser,
    parcel.findById
  )
  .post("/parcels", parcel.create)
  .put(
    "/parcels/:id",
    authorization.authorizeUser,
    parcel.update
  )
  .put(
    "/parcels/:id/cancel",
    authorization.authorizeUser,
    parcel.cancel
  );
export default parcelRouters;
