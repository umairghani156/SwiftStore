import express from 'express';
import multer from 'multer';
import { uploadFileController } from '../controllers/uploadFileController.js';

const uploadFileRoute = express.Router();

// Set up multer for file handling
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Define route
uploadFileRoute.post('/upload', upload.single('profileImage'), uploadFileController);

export default uploadFileRoute;