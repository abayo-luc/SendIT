import { isEmpty } from "../utils/validatorHelpers";
import validator from "validator";
export const signUpValidation = data => {
  const errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password)
    ? data.password
    : "";
  if (isEmpty(data.firstName)) {
    errors.firstName = "Firstname required";
  }
  if (isEmpty(data.lastName)) {
    errors.lastName = "Lastname is required";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "Invalid email";
  }
  if (isEmpty(data.email)) {
    errors.email = "Email is required";
  }
  if (
    !validator.isLength(data.password, { min: 6, max: 30 })
  ) {
    errors.password =
      "Password should be at least 6 characters";
  }
  if (isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    isValid: isEmpty(errors),
    errors
  };
};

export const loginValidator = params => {
  const errors = {};
  params.email = !isEmpty(params.email) ? params.email : "";
  params.password = !isEmpty(params.password)
    ? params.password
    : "";

  if (!validator.isEmail(params.email)) {
    errors.email = "Invalid email";
  }
  if (validator.isEmpty(params.email)) {
    errors.email = "email is required";
  }
  if (validator.isEmail(params.password)) {
    errors.password = "password is required";
  }
  return {
    isValid: isEmpty(errors),
    errors
  };
};
