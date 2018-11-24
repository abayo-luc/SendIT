import { Router } from "express";
import passport from "passport";
import user from "../../../controllers/user";
import validations from "../../../middlewares/validations";
import authorization from "../../../middlewares/authorization";
const userRouters = Router();

// post new user
userRouters
  .post("/users", validations.signup, user.signUp)
  .get(
    "/users/:id/parcels",
    passport.authenticate("jwt", { session: false }),
    validations.checkId,
    authorization.authorizeUser,
    user.parcels
  )
  .post("/login", validations.login, user.signIn)
  .get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    user.current
  );
export default userRouters;
