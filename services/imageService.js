require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET 
});

const uploadImage = async (data) => {
  const imageDetails = await cloudinary.uploader.upload(data,
  function(error, result) {
    if(error) {
      console.log("error uploading image");
      return null;
    } 
  });
  return imageDetails.public_id;
}

module.exports = { uploadImage };