import multer from 'multer';

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(pdf|jpg|jpeg|png|doc|docx|xls|xlsx|zip|mp4)$/i;
    if (allowed.test(file.originalname)) return cb(null, true);
    cb(new Error('Invalid file type'));
  },
});
