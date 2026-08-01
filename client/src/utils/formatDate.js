export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const defaultOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      ...options,
    };

    return new Intl.DateTimeFormat('en-IN', defaultOptions).format(date);
  } catch (error) {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  return formatDate(dateString, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export default formatDate;