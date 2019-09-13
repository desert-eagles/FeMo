// connect to database
const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useCreateIndex: true},
    function (err) {
        if (!err) {
            console.log("Connected to mongoDB");
        } else {
            console.log("Failed to connect to mongoDB: " + err);
            next(err);
        }
    }
);

require("./account.js");
require("./token.js");
require("./user.js");
require("./post.js");

module.exports = mongoose;