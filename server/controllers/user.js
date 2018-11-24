import bcrypt from "bcrypt";
import momemt from "moment";
import jwt from "jsonwebtoken";
//bring in the configuration
import config from "../config/config.json";
// bring in user model
import db from "../database";
import httpResponses from "../utils/httpResponses";
export default class User {
  static parcels(req, res) {
    const queryString = `SELECT * FROM parcels WHERE user_id = $1`;
    const values = [Number(req.params.id)];
    db.findById("users", req.params.id)
      .then(user => {
        if (!user) {
          return httpResponses.bad(
            res,
            404,
            "failed",
            "user not found"
          );
        }
        db.query(queryString, values).then(response => {
          httpResponses.ok(res, 200, "parcels", response);
        });
      })
      .catch(err => {
        httpResponses.bad(
          res,
          500,
          "failed",
          "Internal error",
          err
        );
      });
  }

  static signUp(req, res) {
    const queryText = `
    INSERT INTO users(first_name, last_name, email, password, created_at)
    VALUES($1, $2, $3, $4, $5)
    returning *
    `;
    // refered to https://www.npmjs.com/package/bcryptjs hashing the password++++++
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(
        req.body.password,
        salt,
        (error, hash) => {
          if (error) {
            //console.log(error);
            httpResponses.bad(
              res,
              500,
              "failed",
              "bcrypt hash error"
            );
          }
          const newUser = [
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            hash,
            momemt(new Date())
          ];
          db.query(queryText, newUser)
            .then(userRes => {
              httpResponses.ok(
                res,
                201,
                "user",
                userRes[0],
                "success"
              );
            })
            .catch(err => {
              let message = "Internal server error";
              if (err.routine === "_bt_check_unique")
                message = "User already exist";
              httpResponses.bad(
                res,
                400,
                "failed",
                message,
                err
              );
            });
        }
      );
    });
  }

  // user authentication
  static signIn(req, res) {
    const { email, password } = req.body;
    const queryText = `
      SELECT *  FROM users WHERE email = $1 LIMIT 1
    `;
    const value = [email];
    db.query(queryText, value)
      .then(response => {
        if (!response[0]) {
          return httpResponses.bad(
            res,
            404,
            "failed",
            "User not found"
          );
        }
        bcrypt
          .compare(password, response[0].password)
          .then(isMatch => {
            if (isMatch) {
              // User Matched
              let payload = { ...response[0] };
              delete payload.password;
              jwt.sign(
                payload,
                config.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                  httpResponses.ok(
                    res,
                    200,
                    "token",
                    token,
                    "success"
                  );
                }
              );
            } else {
              httpResponses.bad(
                res,
                400,
                "failed",
                "Invalid email or password"
              );
            }
          });
      })
      .catch(err => {
        httpResponses.bad(
          res,
          500,
          "failed",
          "internal server error",
          err
        );
      });
  }
  //get current user
  static current(req, res) {
    db.findById("users", req.user.id)
      .then(response => {
        const user = { ...response, password: null };
        delete user.password;
        httpResponses.ok(res, 200, "user", user, "success");
      })
      .catch(err => {
        httpResponses.bad(
          res,
          500,
          "failed",
          "Internal server error",
          err
        );
      });
  }
}
