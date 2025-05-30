import cloudinary from "../lib/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", timeout: 60000 },
      (error, result) => {
        if (error) {
          console.error("Cloudinary  upload failed: ", error);
          return reject(
            new Error(`Cloudinary upload failed: ${error.message}`)
          );
        }
        const { secure_url: url, public_id: publicId } = result;
        resolve(result);
      }
    );

    // Pipe the buffer to the Cloudinary stream
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const removeFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error while removing from Cloudinary", error);
    throw new Error("Error while removing from Cloudinary");
  }
};

export { uploadToCloudinary, removeFromCloudinary };
