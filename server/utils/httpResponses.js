export const okResponse = (res, status, data, msg) => {
  const resPayload = {
    status,
    data,
    msg
  };
  return res.status(status).json(resPayload);
};

export const badResponse = (res, status, msg, errors) => {
  const resPayload = {
    status
  };
  if (errors) resPayload.errors = errors;
  if (msg) resPayload.msg = msg;
  res.status(status).json(resPayload);
};
