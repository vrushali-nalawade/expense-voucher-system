export const validateRequest = (schemaValidator) => {
  return (req, res, next) => {
    if (typeof schemaValidator === 'function') {
      const { isValid, errors } = schemaValidator(req.body);
      if (!isValid) {
        return res.status(400).json({
          message: 'Validation failed',
          errors,
        });
      }
    }
    next();
  };
};

export default validateRequest;