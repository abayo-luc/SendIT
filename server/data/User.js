import Database from './Data';
import { isStringInteger } from '../utils/validatorHelpers';

export default class User extends Database {
  constructor() {
    super('users');
  }

  parcels(id) {
    // const user = this.data.users.find(record => record.id === parseInt(id, 10));
    return new Promise((resolve, reject) => {
      if (isStringInteger(id)) {
        resolve(
          this.data.parcels.filter(parcel => parcel.userId === parseInt(id, 10))
        );
      } else {
        reject(new Error('user not found'));
      }
    });
  }
}
