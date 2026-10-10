const path = require('path');
const fs = require('fs');
const multer = require('multer');
const ApiError = require('../utils/ApiError');

const uploadsRoot = path.join(__dirname, '..', 'uploads');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createStorage = (subdir) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(uploadsRoot, subdir);
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype.split('/')[1]);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only image files are allowed'), false);
  }
};

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only PDF files are allowed'), false);
  }
};

const uploadProfileImage = multer({
  storage: createStorage('profiles'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('profileImage');

const uploadProjectImage = multer({
  storage: createStorage('projects'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('image');

const uploadResume = multer({
  storage: createStorage('resumes'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: pdfFilter,
}).single('resume');

const getPublicPath = (subdir, filename) => `/uploads/${subdir}/${filename}`;

const deleteFile = (filePath) => {
  if (!filePath) return;
  const absolute = path.join(uploadsRoot, '..', filePath.replace(/^\//, ''));
  if (fs.existsSync(absolute)) {
    fs.unlinkSync(absolute);
  }
};

module.exports = {
  uploadProfileImage,
  uploadProjectImage,
  uploadResume,
  getPublicPath,
  deleteFile,
};
