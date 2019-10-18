/**
 * Initialise connection to MongoDB and collections
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to database with presaved configuration
mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    function (err) {
        if (!err) {
            console.log("Connected to mongoDB");
        } else {
            console.log("Failed to connect to mongoDB: " + err);
            next(err);
        }
    }
);

// Collections
require("./account.js");
require("./token.js");
require("./user.js");
require("./post.js");
require("./comment.js");
require("./relationship.js");
require("./request.js");

module.exports = mongoose;