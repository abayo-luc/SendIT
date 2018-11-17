import bcrypt from "bcrypt";
// bring in user model
import User from "../data/User";
import { signUpValidation } from "../validations/userValidations";

const userInstance = new User();

export const findUserParcels = (req, res) => {
  userInstance
    .parcels(req.params.id)
    .then(parcels =>
      res.json({ msg: "user pracles", parcels })
    )
    .catch(err =>
      res.status(404).json({ msg: "user not found" })
    );
};

export const createUser = (req, res) => {
  const { isValid, errors } = signUpValidation(req.body);
  if (!isValid) {
    return res
      .status(400)
      .send({ msg: "new user failed", errors });
  }
  const newUser = {
    ...req.body
  };
  const existingUser = userInstance
    .findAll()
    .find(user => user.email === newUser.email);
  if (existingUser) {
    return res
      .status(400)
      .json({ msg: "user already exist" });
  }
  // refered to https://www.npmjs.com/package/bcryptjs hashing the password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (error, hash) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ msg: "bcrypt hash error" });
      }
      newUser.password = hash;
      return userInstance
        .save(newUser)
        .then(user =>
          res
            .status(201)
            .json({ msg: "new user created", user })
        )
        .catch(err => {
          errors.server =
            "There was an internal server error";
          res
            .status(500)
            .send({ msg: "new user failed", errors });
        });
    });
  });
};

// user authentication
export const authenticateUser = (req, res) => {
  const currentUser = userInstance
    .findAll()
    .find(user => user.email === req.body.email);
  // check the encrypted password
  bcrypt
    .compare(req.body.password, currentUser.password)
    .then(pwdMatch => {
      if (!pwdMatch) {
        return res
          .status(400)
          .json({ msg: "invalid email or password" });
      }
      res.json({
        msg: "login sucess",
        user: { ...currentUser }
      });
    });
};
