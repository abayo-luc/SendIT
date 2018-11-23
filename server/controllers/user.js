import bcrypt from "bcrypt";
import momemt from "moment";
import jwt from "jsonwebtoken";
//bring in the configuration
import config from "../config/config.json";
// bring in user model
import db from "../database";
import {
  signUpValidation,
  loginValidator
} from "../validations/userValidations";
import {
  okResponse,
  badResponse
} from "../utils/httpResponses";
export default class User {
  static parcels(req, res) {
    if (!Number(req.params.id)) {
      return badResponse(res, 400, "Invalid id");
    }
    const queryString = `SELECT * FROM parcels WHERE user_id = $1`;
    const values = [Number(req.params.id)];
    db.query(queryString, values)
      .then(response => {
        okResponse(res, 200, "parcels", response);
      })
      .catch(err => {
        //console.log(err);
        badResponse(res, 500, "Internal error", err);
      });
  }

  static signUp(req, res) {
    const { isValid, errors } = signUpValidation(req.body);
    if (!isValid) {
      return badResponse(res, 400, "failed", errors);
    }
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
            badResponse(res, 500, "bcrypt hash error");
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
              okResponse(
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
              badResponse(res, 400, message, err);
            });
        }
      );
    });
  }

  // user authentication
  static signIn(req, res) {
    const { email, password } = req.body;
    const { isValid, errors } = loginValidator({
      email,
      password
    });
    if (!isValid) {
      return badResponse(
        res,
        400,
        "validation error",
        errors
      );
    }
    const queryText = `
      SELECT *  FROM users WHERE email = $1 LIMIT 1
    `;
    const value = [email];
    db.query(queryText, value)
      .then(response => {
        if (!response[0]) {
          return badResponse(res, 404, "User not found");
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
                  okResponse(
                    res,
                    200,
                    "token",
                    `Bearer ${token}`,
                    "success"
                  );
                }
              );
            } else {
              badResponse(
                res,
                400,
                "Invalid email or password"
              );
            }
          });
      })
      .catch(err => {
        //console.log(err);
        badResponse(res, 500, "internal server error", err);
      });
  }
}
