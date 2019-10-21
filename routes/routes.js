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
var familyController = require("../controllers/familyController");

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
router.get('/connect', userController.authChecker, function (req, res) {
    res.render('connect');
});

router.get('/request', userController.authChecker, function (req, res) {
    res.render("request");
});

// Search for other users
router.post('/search-users', userController.searchUsers);

// Send request to other user
router.post('/send-request', requestController.sendRequest);

// Search for requests received by user
router.post('/get-requests', requestController.getRequests);

// Accept request received
router.post('/accept-request', requestController.acceptRequest);

// Decline request received
router.post('/decline-request', requestController.declineRequest);

// Get all the connections of users
router.post('/get-connections', userController.getConnections);

// Delete relationship with other user
router.post('/delete-relationship', userController.deleteRelationship);

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

// Direct to create-family page
router.get('/create-family', userController.authChecker, function (req, res) {
    res.render('createFamily');
});

// Create a new family
router.post('/create-family',
    uploader.uploadFamilyPic.single("family-picture"),
    familyController.createFamily);

// Pull a connection into family
router.post('/invite-to-family', familyController.inviteToFamily);

// Remove a connection from family
router.post('/remove-from-family', familyController.removeFromFamily);

// Delete family
router.post('/delete-family', familyController.deleteFamily);

// Direct to all families page
router.get('/families', userController.authChecker, function (req, res) {
    res.render('families');
});

// Get families
router.post('/get-families', familyController.getFamilies);

// Direct to family page
router.get('/family/:family_id', userController.authChecker, function (req, res) {
    res.render('family', {family_id: req.params.family_id});
});

// Get family details
router.post('/get-family', familyController.getFamily);

/*****************************************************************************/

module.exports = router;