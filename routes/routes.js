var express = require('express');
var router = express.Router();

var uploader = require('../controllers/cloudinary');
var accountController = require("../controllers/accountController");
var userController = require("../controllers/userController");
var postController = require("../controllers/postController");

/* GET home page. */
router.get('/', userController.sessionChecker, function (req, res) {
    res.render("index");
});


/* User logic */
router.post("/signup", accountController.signupPost);
router.post("/signin", accountController.loginPost);
router.post("/check-email-availability", accountController.emailAvailable);
router.get("/confirm-email/:token", accountController.confirmEmail);
router.post("/resend-confirmation", accountController.resendConfirmation);

/* GET user-details */
router.get('/user-details', userController.authChecker, function (req, res) {
    res.render("userDetails");
});


router.post('/user-details',
    uploader.uploadProfilePic.single("profile-picture"),
    userController.saveNewUser);


router.get('/user', userController.authChecker, function (req, res) {
    res.render("user");
});


// upload
router.get('/upload', userController.authChecker, function (req, res) {
    res.render('upload');
});


router.post('/upload', uploader.uploadPostPics.any(), postController.createPost);



router.get('/more-posts/:page', userController.authChecker, postController.fetchPosts);

// logout
router.get('/logout', userController.logout);

module.exports = router;