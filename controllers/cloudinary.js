/**
 * Connect to cloudinary for storing photos
 */

const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

require('dotenv').config();

// Set up cloudinary configurations
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// For storing profile pictures of users
let profileStorage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "profile_pictures",
    allowedFormats: ["jpg", "png"],
    transformation: [{width: 200, height: 200, radius: "max"}]
});

// For storing photos uploaded by users
// TODO transformation
let postStorage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "post_pictures",
    allowedFormats: ["jpg", "png"]
});


let uploadProfilePic = multer({storage: profileStorage});
let uploadPostPics = multer({storage: postStorage});

module.exports = {
    uploadProfilePic,
    uploadPostPics
};