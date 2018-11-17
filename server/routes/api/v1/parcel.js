import { Router } from "express";
// bring parcel model
import {
  findAll,
  findById,
  createParcel,
  updateParcel,
  cancelParcel
} from "../../../controllers/parcel";

const parcelRouters = Router();

parcelRouters
  .get("/parcels", findAll)
  .get("/parcels/:id", findById)
  .post("/parcels", createParcel)
  .put("/parcels/:id", updateParcel)
  .put("/parcels/:id/cancel", cancelParcel);
export default parcelRouters;
