export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'Signature image size exceeds 2MB limit.',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

export default errorHandler;