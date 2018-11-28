const ok = (
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

const bad = (res, code, status, msg, errors) => {
  const resPayload = {
    status
  };
  if (errors) resPayload.errors = errors;
  if (msg) resPayload.message = msg;
  res.status(code).json(resPayload);
};
const unauthorized = res => {
  const resPayload = {
    status: "failed",
    message: "unauthorized"
  };
  res.status(401).json(resPayload);
};

export default {
  ok,
  bad,
  unauthorized
};
