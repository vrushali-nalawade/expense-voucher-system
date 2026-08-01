import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadBaseDir = path.resolve('uploads');
const employeeSigDir = path.join(uploadBaseDir, 'employee-signatures');
const directorSigDir = path.join(uploadBaseDir, 'director-signatures');

if (!fs.existsSync(employeeSigDir)) {
  fs.mkdirSync(employeeSigDir, { recursive: true });
}
if (!fs.existsSync(directorSigDir)) {
  fs.mkdirSync(directorSigDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'directorSignature') {
      cb(null, directorSigDir);
    } else {
      cb(null, employeeSigDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP signature images are allowed.'), false);
  }
};

export const uploadSignature = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export default uploadSignature;