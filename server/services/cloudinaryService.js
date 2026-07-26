const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an in-memory file buffer (from Multer memoryStorage) to Cloudinary.
 * @param {Buffer} buffer - the raw file buffer
 * @param {string} folder - Cloudinary folder, e.g. "baig-tours/packages"
 * @param {string} resourceType - 'image' | 'video' | 'auto'
 * @returns {Promise<{url: string, publicId: string}>}
 */
function uploadBuffer(buffer, folder = 'baig-tours', resourceType = 'auto') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Deletes an asset from Cloudinary by its public_id.
 * @param {string} publicId
 * @param {string} resourceType - 'image' | 'video'
 */
function deleteAsset(publicId, resourceType = 'image') {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

module.exports = { uploadBuffer, deleteAsset };
