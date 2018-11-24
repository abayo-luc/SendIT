import { Router } from "express";
import passport from "passport";
// bring parcel model
import parcel from "../../../controllers/parcel";

const parcelRouters = Router();
parcelRouters.use(
  passport.authenticate("jwt", { session: false })
);
parcelRouters
  .get("/parcels", parcel.findAll)
  .get("/parcels/:id", parcel.findById)
  .post("/parcels", parcel.create)
  .put("/parcels/:id", parcel.update)
  .put("/parcels/:id/cancel", parcel.cancel);
export default parcelRouters;
