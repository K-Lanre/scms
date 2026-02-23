const multer = require('multer');
const AppError = require('../utils/appError');
const fs = require('fs');
const path = require('path');

// Ensure upload directory exists
const uploadDir = 'public/img/users';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        // user-{id}-{timestamp}.jpeg
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new AppError('Invalid file type! Please upload only images or PDFs.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadOnboardingImages = upload.fields([
    { name: 'idImage', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
]);

exports.uploadProfileAndDocs = upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 }
]);

exports.uploadProfilePicture = upload.single('profilePicture');
