import bcrypt from "bcrypt";
import momemt from "moment";
import jwt from "jsonwebtoken";
// bring in user model
import db from "../database";
import httpResponses from "../utils/httpResponses";
export default class User {
  static parcels(req, res) {
    let queryString;
    let values;
    req.query.status
      ? (queryString = `SELECT * FROM parcels WHERE user_id = $1 AND status=$2`)
      : (queryString = `SELECT * FROM parcels WHERE user_id = $1`);
    req.query.status
      ? (values = [Number(req.params.id), req.query.status])
      : (values = [Number(req.params.id)]);
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
        db.query(queryString, values, true).then(
          response => {
            httpResponses.ok(res, 200, "parcels", response);
          }
        );
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
            return httpResponses.bad(
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
              const payload = {
                id: userRes.id,
                email: userRes.email,
                is_admin: userRes.is_admin
              };
              const user = { ...userRes };
              delete user.password;
              jwt.sign(
                payload,
                process.env.secretOrKey,
                { expiresIn: "7d" },
                (err, token) => {
                  const resPayload = {
                    status: "success",
                    user,
                    token
                  };
                  res.status(201).json({ ...resPayload });
                }
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

  // user signup
  static signIn(req, res) {
    const { email, password } = req.body;
    const queryText = `
      SELECT *  FROM users WHERE email = $1 LIMIT 1
    `;
    const value = [email];
    db.query(queryText, value)
      .then(response => {
        if (!response) {
          return httpResponses.bad(
            res,
            404,
            "failed",
            "User not found"
          );
        }
        bcrypt
          .compare(password, response.password)
          .then(isMatch => {
            if (isMatch) {
              // User Matched
              let payload = {
                id: response.id,
                email: response.email,
                is_admin: response.is_admin
              };
              delete payload.password;
              jwt.sign(
                payload,
                process.env.secretOrKey,
                { expiresIn: "7d" },
                (err, token) => {
                  res.status(200).json({
                    status: "success",
                    user: payload,
                    token
                  });
                }
              );
            } else {
              return httpResponses.bad(
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
  static currentUser(req, res) {
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
