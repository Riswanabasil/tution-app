import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/tutorDocs'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

export const uploadTutorDocs = upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]);
