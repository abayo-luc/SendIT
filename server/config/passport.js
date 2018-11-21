import config from "../config/config.json";
import {
  Strategy as JwtStrategy,
  ExtractJwt
} from "passport-jwt";
// db things
import db from "../database";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretOrKey;
export default passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      db.findById("users", jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
