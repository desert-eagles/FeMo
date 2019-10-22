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
let postStorage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "post_pictures",
    allowedFormats: ["jpg", "png"]
});

// For storing family profile pictures
let familyStorage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "family_pictures",
    allowedFormats: ["jpg", "png"],
    transformation: [{width: 200, height: 200, radius: "max"}]
});


let uploadProfilePic = multer({storage: profileStorage});
let uploadPostPics = multer({storage: postStorage});
let uploadFamilyPic = multer({storage: familyStorage});

module.exports = {
    uploadProfilePic,
    uploadPostPics,
    uploadFamilyPic
};