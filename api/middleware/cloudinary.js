const cloudinary = require('cloudinary');
const multer = require('multer');
const storage = require('../../config/cloudinaryConfig');

module.exports = {
    async deleteCloudImage(req, res, next) {
      if (req.user.public_id) {
        try {
          const deleteCloudImage = await cloudinary.uploader.destroy(
            req.user.public_id
          );
          req.deleteCloudImage = deleteCloudImage;
        } catch (error) {
          return next(error.message);
        }
      }
      return next();
    },
    uploadImage(image) {
      const parser = multer({ storage });
      return parser.single(image);
    }
  };