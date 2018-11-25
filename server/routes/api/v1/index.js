import { Router } from "express";
import userRouters from "./user";
import parcelRouters from "./parcel";

const routers = Router();
routers.get("/unthorized", (req, res) =>
  res
    .status(401)
    .json({ status: "failed", message: "Unauthorized" })
);
routers.use(userRouters, parcelRouters);

export default routers;
