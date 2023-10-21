const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadToCloudinary = async (path, folder = "product_images") => {
    try {
        const data = await cloudinary.uploader.upload(path, { folder: folder });
        return { url: data.secure_url, publicId: data.public_id };
    } catch (err) {
        console.log("upload to cloudinary error:");
        console.log(err);
        throw err;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.log("delete from cloudinary error:");
        console.log(err);
        throw err;
    }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
