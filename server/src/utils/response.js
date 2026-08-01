export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

export const sendError = (res, message, statusCode = 400, errors = null) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    errors,
  });
};

export default {
  sendSuccess,
  sendError,
};