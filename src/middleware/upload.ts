import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname);
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false);
  }
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });
