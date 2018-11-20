import { Router } from "express";
// bring parcel model
import parcel from "../../../controllers/parcel";

const parcelRouters = Router();

parcelRouters
  .get("/parcels", parcel.findAll)
  .get("/parcels/:id", parcel.findById)
  .post("/parcels", parcel.create)
  .put("/parcels/:id", parcel.update)
  .put("/parcels/:id/cancel", parcel.cancel);
export default parcelRouters;
