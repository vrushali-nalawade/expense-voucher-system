export const formatVoucherNumber = (sequenceNumber) => {
  const year = new Date().getFullYear();
  const paddedSequence = String(sequenceNumber).padStart(3, '0');
  return `VCH-${year}-${paddedSequence}`;
};

export default formatVoucherNumber;