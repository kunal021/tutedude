import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filepath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      folder: "tutedude",
      resource_type: "image",
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
      ...options,
    });

    return result;
  } catch (error) {
    throw {
      status: 500,
      message: "Error uploading file to Cloudinary: " + error.message,
    };
  }
};

export default uploadToCloudinary;
