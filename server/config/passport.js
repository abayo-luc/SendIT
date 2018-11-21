import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt
} from "passport-jwt";
import keys from "./keys.json";
//bring in user model
import User from "../data/User";
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

export default passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // more configuration
    })
  );
};
