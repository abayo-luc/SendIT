import { Router } from "express";
import passport from "passport";
// bring parcel model
import parcel from "../../../controllers/parcel";
//validation and authorization
import authorization from "../../../middlewares/authorization";
import validation from "../../../middlewares/validations";
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
  .get("/parcels/:id", validation.checkId, parcel.findById)
  .post("/parcels", validation.parcel, parcel.create)
  .put("/parcels/:id", validation.checkId, parcel.update)
  .put(
    "/parcels/:id/cancel",
    validation.checkId,
    parcel.cancel
  );
export default parcelRouters;
