import { findIndex } from '../utils/queryHelper';

const data = {
  pacerls: [],
  users: []
};

class Database {
  constructor(key) {
    this.key = key;
    this.createdAt = new Date();
  }

  findAll() {
    return data[this.key];
  }

  save() {
    const newItem = { id: data[this.key].length + 1, ...this };
    delete newItem.key;
    const index = data[this.key].unshift(newItem);
    return new Promise((resolve, reject) => {
      if (index >= 0) {
        resolve(data[this.key][0]);
      } else {
        reject(new Error('create failed'));
      }
    });
  }

  find(id) {
    const parcel = data[this.key].find(item => item.id === parseInt(id, 10));
    return new Promise((resolve, reject) => {
      if (parcel) {
        resolve(parcel);
      } else {
        reject(new Error('parcel not found'));
      }
    });
  }

  update(id, newAttributes) {
    const index = findIndex(data[this.key], id);
    const item = data[this.key][index];
    return new Promise((resolve, reject) => {
      if (index >= 0 && item) {
        resolve(
          (data[this.key][index] = {
            ...item,
            ...newAttributes
          })
        );
      } else {
        reject(new Error('Update failed'));
      }
    });
  }

  delete(id) {
    const index = findIndex(data[this.key], id);
    const item = data[this.key][index];
    return new Promise((resolve, reject) => {
      if (index && item) {
        resolve(data[this.key].splice(index, 1));
      } else {
        reject(new Error('delete failed'));
      }
    });
  }

  clearn() {
    data[this.key].length = 0;
  }
}

export default Database;