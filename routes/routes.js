var express = require('express');
var router = express.Router();

var accountController = require("../controllers/accountController");

/* GET home page. */
router.get('/', function(req, res) {
    res.render("index");
});


router.post("/check-email-availability", accountController.emailAvailable);

/* POST Signup */
router.post("/signup", accountController.signupPost);
router.post("/signin", accountController.loginPost);
module.exports = router;
