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

    //     req.session.user.firstname
    //     req.session.user.lastname
    //     req.session.user.gender
    //     req.session.user.dob.toString()
    //     req.session.user.nickname
    //     req.session.user.pic_id
    //     req.session.user.pic_url
});


// upload
router.get('/upload', userController.authChecker, function (req, res) {
    res.render('upload');
});



router.post('/upload', uploader.uploadPostPics.any(), userController.createPost);

// router.post('/upload', uploader.uploadPostPics.any(), function (req, res) {
//     console.log(req.files);
//
//     res.status(404);
//     res.send("Test");
// });


// logout
router.get('/logout', userController.logout);

module.exports = router;