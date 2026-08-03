export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const isMinLength = (str, minLength = 6) => {
  return typeof str === 'string' && str.length >= minLength;
};

export default { isValidEmail, isMinLength };
