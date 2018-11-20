export const okResponse = (res, status, key, data, msg) => {
  const resPayload = {
    status,
    message: msg,
    [key]: data
  };
  return res.status(status).json(resPayload);
};

export const badResponse = (res, status, msg, errors) => {
  const resPayload = {
    status
  };
  if (errors) resPayload.errors = errors;
  if (msg) resPayload.message = msg;
  res.status(status).json(resPayload);
};
