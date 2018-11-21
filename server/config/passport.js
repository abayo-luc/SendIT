import passport from "passport";
import config from "../config/config.json";
import {
  Strategy as JwtStrategy,
  ExtractJwt
} from "passport-jwt";
//bring in the databse
import db from "../database/index";
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretOrKey;

export default passport => {
  passport.use(opts, (jwt_payload, done) => {
    db.findById("users", jwt_payload.id)
      .then(user => {
        console.log(user);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => console.log(err));
  });
};
