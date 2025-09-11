const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: "dpfb1od3c",
  api_key: "988836346312584",
  api_secret: "h4pbbvxXRBse9QMvcz4I8iL9KL4",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "devTinder_user_profiles", // folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
