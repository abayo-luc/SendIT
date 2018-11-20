import bcrypt from "bcrypt";
// bring in user model
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
    const newUser = {
      ...req.body
    };
    const existingUser = userInstance
      .findAll()
      .find(user => user.email === newUser.email);
    if (existingUser) {
      return badResponse(res, 400, "user already exist");
    }
    // refered to https://www.npmjs.com/package/bcryptjs hashing the password++++++
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (error, hash) => {
        if (error) {
          console.log(error);
          badResponse(res, 500, "bcrypt hash error");
        }
        newUser.password = hash;
        return userInstance
          .save(newUser)
          .then(user => {
            const userRes = {
              id: user.id,
              lastName: user.lastName,
              firstName: user.firstName,
              email: user.email
            };
            return okResponse(
              res,
              201,
              "user",
              userRes,
              "success"
            );
          })
          .catch(err =>
            badResponse(
              res,
              500,
              "Internal server error",
              err
            )
          );
      });
    });
  }

  // user authentication
  static signIn(req, res) {
    const currentUser = userInstance
      .findAll()
      .find(user => user.email === req.body.email);
    // check the encrypted password
    bcrypt
      .compare(req.body.password, currentUser.password)
      .then(pwdMatch => {
        if (!pwdMatch) {
          return badResponse(
            res,
            400,
            "invalid email or password"
          );
        }
        return okResponse(
          res,
          200,
          "user",
          currentUser,
          "success"
        );
      })
      .catch(err =>
        badResponse(res, 500, "internal server error", err)
      );
  }
}
