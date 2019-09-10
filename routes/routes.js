var express = require('express');
var router = express.Router();

var accountController = require("../controllers/accountController");

/* GET home page. */
router.get('/', function (req, res) {
    res.render("index");
});

/* GET confirmEmail */
router.get('/confirm-email/:token', accountController.confirmEmail);

/* GET reception */
router.get('/reception', function (req, res) {
    res.render("reception");
});

router.get('/user', function (req, res) {
    res.send("You have logged in, this is user page");
});

/* POST sign up */
router.post("/signup", accountController.signupPost);
router.post("/check-email-availability", accountController.emailAvailable);


/* Post sign in */
router.post("/signin", accountController.loginPost);

module.exports = router;
