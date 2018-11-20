import { isEmpty } from "../utils/validatorHelpers";

export const signUpValidation = data => {
  const errors = {};
  if (isEmpty(data.firstName)) {
    errors.firstName = "Firstname required";
  }
  if (isEmpty(data.lastName)) {
    errors.lastName = "Lastname is required";
  }
  if (isEmpty(data.email)) {
    errors.email = "Email is required";
  }
  if (isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    isValid: isEmpty(errors),
    errors
  };
};

export const signInValidation = data => {
  const errors = {};
  if (isEmpty(data.email)) {
    errors.email = "Email is required";
  }
  if (isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    isValid: isEmpty(errors),
    errors
  };
};
