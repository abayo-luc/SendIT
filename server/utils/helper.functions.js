export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" &&
    !Object.keys(value).length) ||
  (typeof value === "string" && !value.trim().length);

export const isInteger = value =>
  Number.isInteger(value) &&
  /^\+?(0|[1-9]\d*)$/.test(value);

export const isStringInteger = value =>
  /^\+?(0|[1-9]\d*)$/.test(value);
