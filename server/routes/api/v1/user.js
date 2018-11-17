import { Router } from "express";
import {
  findUserParcels,
  createUser,
  authenticateUser
} from "../../../controllers/user";

const userRouters = Router();

// post new user
userRouters
  .post("/users", createUser)
  .get("/users/:id/parcels", findUserParcels)
  .post("/login", authenticateUser);
export default userRouters;
