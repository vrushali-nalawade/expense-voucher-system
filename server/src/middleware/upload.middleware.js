import { uploadSignature } from '../config/multer.js';

export const uploadEmployeeSignature = uploadSignature.single('signature');
export const uploadDirectorSignature = uploadSignature.single('directorSignature');

export default {
  uploadEmployeeSignature,
  uploadDirectorSignature,
};