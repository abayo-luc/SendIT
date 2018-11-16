import bcrypt from 'bcrypt';
// bring in user model
import User from '../data/User';
import { signUpValidation } from '../validations/userValidations';

const userInstance = new User();

export const findUserParcels = (req, res) => {
  userInstance
    .parcels(req.params.id)
    .then(parcels => res.json({ msg: 'user pracles', parcels }))
    .catch(err => res.status(404).json({ msg: 'user not found' }));
};

export const createUser = (req, res) => {
  const { isValid, errors } = signUpValidation(req.body);
  if (!isValid) {
    return res.status(400).send({ msg: 'new user failed', errors });
  }
  const newUser = {
    ...req.body
  };
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (error, hash) => {
      if (error) {
        console.log(error);
      }
      newUser.password = hash;
      userInstance
        .save(newUser)
        .then(user => res.json({ msg: 'new user created', user }))
        .catch((err) => {
          errors.server = 'There was an internal server error';
          res.status(500).send({ msg: 'new user failed', errors });
        });
    });
  });
};
export const authenticateUser = (req, res) => {
  const currentUser = userInstance.findAll().find(user => user.email === req.body.email);
  if (currentUser.password === req.body.password) {
    return res.json({ msg: 'login sucess', user: { ...currentUser } });
  }
  res.status(400).json({ msg: 'invalid email or password' });
};
