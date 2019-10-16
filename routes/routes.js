/**
 * Contains route definitions for the application
 */


var express = require('express');
var router = express.Router();

// Route handler functions
var uploader = require('../controllers/cloudinary');
var accountController = require("../controllers/accountController");
var userController = require("../controllers/userController");
var postController = require("../controllers/postController");
var requestController = require("../controllers/requestController");

// Home page
router.get('/', userController.sessionChecker, function (req, res) {
    res.render("index");
});

/****************************** Account logic ********************************/

// Register
router.post("/signup", accountController.signupPost);

// Login
router.post("/signin", accountController.loginPost);

// Check email is available
router.post("/check-email-availability", accountController.emailAvailable);

// Confirm email
router.get("/confirm-email/:token", accountController.confirmEmail);

// Resend confirmation email
router.post("/resend-confirmation", accountController.resendConfirmation);


/*************************** User and Post logic *****************************/

// Show user details page
router.get('/user-details', userController.authChecker, function (req, res) {
    res.render("userDetails");
});

// Save user details
router.post('/user-details',
    uploader.uploadProfilePic.single("profile-picture"),
    userController.saveNewUser);

// User main page
router.get('/user', userController.authChecker, function (req, res) {
    res.render("user");
});

// Upload page
router.get('/upload', userController.authChecker, function (req, res) {
    res.render('upload');
});

// Relation page
router.get('/addRelation', userController.authChecker, function (req, res) {
    res.render('addRelation');
});

// Search for other users
router.post('/addRelation', userController.searchUsers);

// Send request to other user
router.post('/send-request', requestController.sendRequest);

// Save post uploaded by user
router.post('/upload', uploader.uploadPostPics.any(), postController.createPost);

// Fetch posts for user
router.get('/more-posts/:page', userController.authChecker, postController.fetchPosts);

// User likes or unlikes a post
router.post('/toggle-like', postController.toggleLike);

// Save user's comment on post
router.post('/comment-post', postController.commentPost);

// Delete user's comment on post
router.post('/delete-comment', postController.deleteComment);

// Logout
router.get('/logout', userController.logout);


/*****************************************************************************/

module.exports = router;