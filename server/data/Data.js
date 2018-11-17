import { findIndex } from "../utils/queryHelper";
import data from "./data.json";

class Database {
  constructor(key) {
    this.key = key;
    this.data = data;
  }

  findAll() {
    return data[this.key];
  }

  save(params) {
    const newItem = {
      id: data[this.key].length + 1,
      ...params,
      createdAt: new Date()
    };
    delete newItem.key;
    const index = data[this.key].unshift(newItem);
    return new Promise((resolve, reject) => {
      if (index >= 0) {
        resolve(data[this.key][0]);
      } else {
        reject(new Error("create failed"));
      }
    });
  }

  find(id) {
    const parcel = /^\+?(0|[1-9]\d*)$/.test(id)
      ? data[this.key].find(
          item => item.id === parseInt(id, 10)
        )
      : null;
    return new Promise((resolve, reject) => {
      if (parcel) {
        resolve(parcel);
      } else {
        reject(new Error("parcel not found"));
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
        reject(new Error("Update failed"));
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
        reject(new Error("delete failed"));
      }
    });
  }

  clean() {
    data[this.key].length = 0;
  }
}

export default Database;
