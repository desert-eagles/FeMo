// connect to database
const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useCreateIndex: true},
    function (err) {
        if (!err) {
            console.log("Connected to mongoDB");
        } else {
            console.log("Failed to connect to mongoDB: " + err);
        }
    }
);

require("./account.js");
require("./token.js");
