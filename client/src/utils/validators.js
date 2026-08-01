export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateVoucherForm = (data, isFinalSubmission = false) => {
  const errors = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Expense Title is mandatory';
  }

  if (!data.department) {
    errors.department = 'Department is mandatory';
  }

  if (!data.expenseDate) {
    errors.expenseDate = 'Expense Date is mandatory';
  }

  if (data.amount === undefined || data.amount === null || data.amount === '') {
    errors.amount = 'Amount is mandatory';
  } else if (Number(data.amount) <= 0) {
    errors.amount = 'Amount must be greater than zero';
  }

  if (isFinalSubmission && !data.signature && !data.signatureUrl) {
    errors.signature = 'Employee Signature is mandatory before submitting for approval';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateApprovalForm = (data, action) => {
  const errors = {};

  if (action === 'approve' && !data.signature && !data.signatureUrl) {
    errors.signature = "Director's approval signature is mandatory";
  }

  if (action === 'reject' && (!data.rejectionReason || !data.rejectionReason.trim())) {
    errors.rejectionReason = 'Rejection reason is mandatory when rejecting a voucher';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};