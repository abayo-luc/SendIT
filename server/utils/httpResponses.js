const okResponse = (
  res,
  code,
  key,
  data,
  status = "success",
  msg
) => {
  const resPayload = {
    status,
    message: msg,
    [key]: data
  };
  return res.status(code).json(resPayload);
};

const badResponse = (res, code, status, msg, errors) => {
  const resPayload = {
    status
  };
  if (errors) resPayload.errors = errors;
  if (msg) resPayload.message = msg;
  res.status(code).json(resPayload);
};

export default {
  okResponse,
  badResponse
};
