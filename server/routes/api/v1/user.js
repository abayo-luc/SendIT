import { Router } from "express";
import passport from "passport";
import User from "../../../controllers/user";
import validations from "../../../middlewares/validations";
import authorization from "../../../middlewares/authorization";
const userRouters = Router();

// post new user
userRouters
  .post("/users", validations.signup, User.signUp)
  .get(
    "/users/:id/parcels",
    passport.authenticate("jwt", {
      session: false,
      failureRedirect: "/api/v1/unthorized"
    }),
    validations.checkId,
    authorization.user,
    User.parcels
  )
  .post("/login", validations.login, User.signIn)
  .get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    User.currentUser
  );
export default userRouters;
