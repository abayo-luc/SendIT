import bcrypt from "bcrypt";
import uuid from "uuid";
import momemt from "moment";
// bring in user model
import db from "../database";
import userModel from "../data/User";
import { signUpValidation } from "../validations/userValidations";
import {
  okResponse,
  badResponse
} from "../utils/httpResponses";
const userInstance = new userModel();
export default class User {
  static parcels(req, res) {
    userInstance
      .parcels(req.params.id)
      .then(parcels => {
        if (!parcels) {
          return badResponse(res, 404, "user not found");
        }
        okResponse(res, 200, "parcels", parcels);
      })
      .catch(err =>
        badResponse(res, 500, "Internal error", err)
      );
  }

  static signUp(req, res) {
    const { isValid, errors } = signUpValidation(req.body);
    if (!isValid) {
      return badResponse(res, 400, "failed", errors);
    }
    const queryText = `
    INSERT INTO users(id, first_name, last_name, email, password, created_at)
    VALUES($1, $2, $3, $4, $5, $6)
    returning *
    `;
    // refered to https://www.npmjs.com/package/bcryptjs hashing the password++++++
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(
        req.body.password,
        salt,
        (error, hash) => {
          if (error) {
            console.log(error);
            badResponse(res, 500, "bcrypt hash error");
          }
          const newUser = [
            uuid(),
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
                userRes,
                "sucess"
              );
            })
            .catch(err => {
              badResponse(
                res,
                500,
                "Internal server error",
                err
              );
            });
        }
      );
    });
  }

  // user authentication
  static signIn(req, res) {
    const queryText = `
      SELECT *  FROM users WHERE email = $1 LIMIT 1
    `;
    const value = [req.body.email];
    db.query(queryText, value)
      .then(response => {
        if (!response[0]) {
          return badResponse(
            res,
            400,
            "invalid email or password"
          );
        }
        let user = { ...response[0] };
        delete user.password;
        okResponse(res, 200, "user", user, "success");
      })
      .catch(err => {
        badResponse(res, 500, "internal server error", err);
      });
  }
}
