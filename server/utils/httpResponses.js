export const okResponse = (
  res,
  code,
  status,
  key,
  data
) => {
  const resPayload = {
    status,
    [key]: data
  };
  return res.status(code).json(resPayload);
};

export const badResponse = (
  res,
  code,
  status,
  msg,
  errors
) => {
  const resPayload = {
    status
  };
  if (errors) resPayload.errors = errors;
  if (msg) resPayload.message = msg;
  res.status(code).json(resPayload);
};
