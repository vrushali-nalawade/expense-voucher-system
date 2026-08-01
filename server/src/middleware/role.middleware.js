export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden. User role not defined.' });
    }

    const userRole = req.user.role.toLowerCase();
    const isAllowed = allowedRoles.some((role) => role.toLowerCase() === userRole);

    if (!isAllowed) {
      return res.status(403).json({
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};

export default authorizeRoles;