import { isEmpty } from "./helper.functions";
import validator from "validator";
import {
  STATUS_DELIVERED,
  STATUS_WAITING,
  STATUS_INTRANSIT
} from "./constants";
export default class {
  static checkPresence(params, keys) {
    let errors = {};
    for (let key of keys) {
      params[key] = isEmpty(params[key]) ? "" : params[key];
      try {
        key === "email" &&
          !validator.isEmail(params[key]) &&
          (errors[key] = "Invalid email");
        if (validator.isEmpty(params[key].toString()))
          errors[key] = `${key} is required`;
      } catch (err) {
        errors.server = "lkfjdlk";
        console.log(err);
      }
    }
    return {
      isValid: isEmpty(errors),
      errors
    };
  }

  static isStatusExist(data) {
    return [
      STATUS_DELIVERED,
      STATUS_WAITING,
      STATUS_INTRANSIT
    ].includes(data.status);
  }
}
