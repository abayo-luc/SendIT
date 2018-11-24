import { isEmpty } from "../utils/validatorHelpers";
import validator from "validator";
export default class {
  static checkPresence(params, keys) {
    let errors = {};
    for (let key of keys) {
      params[key] = isEmpty(params[key]) ? "" : params[key];
      try {
        key === "email" && !validator.isEmail(params[key])
          ? (errors[key] = "Invalid email")
          : null;
        if (validator.isEmpty(params[key]))
          errors[key] = `${key} is required`;
      } catch (err) {
        //console.log(key);
      }
    }
    return {
      isValid: isEmpty(errors),
      errors
    };
  }
}
