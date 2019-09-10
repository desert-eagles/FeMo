var express = require('express');
var router = express.Router();

var accountController = require("../controllers/accountController");

/* GET home page. */
router.get('/', function (req, res) {
    res.render("index");
});


/* User logic */
router.post("/signup", accountController.signupPost);
router.post("/signin", accountController.loginPost);
router.post("/check-email-availability", accountController.emailAvailable);
router.get("/confirm-email/:token", accountController.confirmEmail);
router.post("/resend-confirmation", accountController.resendConfirmation);


// TODO
router.get('/user', function (req, res) {
    res.send("You have logged in, this is user page");
});

module.exports = router;