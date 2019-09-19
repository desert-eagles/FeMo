var express = require('express');
var router = express.Router();

var uploader = require('../controllers/cloudinary');
var accountController = require("../controllers/accountController");
var userController = require("../controllers/userController");

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

// TODO
router.get('/user', userController.authChecker, function (req, res) {
    res.render("user");
    // res.send("<p>You have logged in, this is user page. Your name is " +
    //     req.session.user.firstname + " " + req.session.user.lastname +
    //     "\nGender: " + req.session.user.gender +
    //     "\nDate of Birth: " + req.session.user.dob.toString() +
    //     "\nNickname: " + req.session.user.nickname +
    //     "\nProfile pic id: " + req.session.user.pic_id +
    //     "\nProfile pic url: " + req.session.user.pic_url +
    //     `</p><img src=\"${req.session.user.pic_url}\">`);
});


// upload
router.get('/upload', function (req, res) {
    res.render("upload.html");
});


// logout
router.get('/logout', userController.logout);

module.exports = router;