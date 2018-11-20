import { Router } from "express";
import user from "../../../controllers/user";

const userRouters = Router();

// post new user
userRouters
  .post("/users", user.signUp)
  .get("/users/:id/parcels", user.parcels)
  .post("/login", user.login);
export default userRouters;
