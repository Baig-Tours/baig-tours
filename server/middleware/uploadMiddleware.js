const multer = require('multer');

const storage = multer.memoryStorage();

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

function fileFilter(req, file, cb) {
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype === 'video/mp4';

  if (!isImage && !isVideo) {
    return cb(new Error('Only image files or MP4 video files are allowed'));
  }
  cb(null, true);
}

// Multer only supports one size limit per instance, so cap at the larger
// (video) limit here; enforce the stricter image limit manually in the
// controller/service layer if needed.
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_VIDEO_SIZE },
});

module.exports = { upload, MAX_IMAGE_SIZE, MAX_VIDEO_SIZE };
