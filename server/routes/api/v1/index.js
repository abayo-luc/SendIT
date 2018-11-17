import { Router } from "express";
import userRouters from "./user";
import parcelRouters from "./parcel";

const routers = Router();

routers.use(userRouters, parcelRouters);

export default routers;
