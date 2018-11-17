import DataModel from "./Data";
import { isStringInteger } from "../utils/validatorHelpers";

export default class User extends DataModel {
  constructor() {
    super("users");
  }

  parcels(id) {
    // const user = this.data.users.find(record => record.id === parseInt(id, 10));
    return new Promise((resolve, reject) => {
      try {
        if (isStringInteger(id)) {
          resolve(
            this.data.parcels.filter(
              parcel => parcel.userId === parseInt(id, 10)
            )
          );
        } else {
          resolve(null);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}
