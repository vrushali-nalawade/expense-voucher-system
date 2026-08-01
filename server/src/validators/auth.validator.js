export const validateLoginPayload = (data) => {
  const errors = {};

  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterPayload = (data) => {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Full name is required';
  }

  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (!data.department) {
    errors.department = 'Department is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};