import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFileController =async (req, res) => {
    if (!req.file) return res.status(403).json("Something went wrong");

    const localFilePath = path.join('/tmp', req.file.filename); // Use /tmp directory
    console.log('Local file path:', localFilePath);

   try{

    const result = await cloudinary.uploader.upload(localFilePath, { folder: "uploads" });

        // Delete the local file after upload
        fs.unlink(localFilePath, (err) => {
            if (err) console.error('Failed to delete local file:', err);
        });

       

        res.status(200).json({
            status: true,
            message: "File uploaded successfully",
            url: result.secure_url,
            file: result
        });
   }catch(error){
    res.status(500).json({
        status: false,
        message: "File upload to Cloudinary failed",
        error: error.message
    });
   }
};

