// connect to database
const mongoose = require('mongoose');
const mongoDB = "mongodb+srv://admin:TCgUBpJ1McEdqWWC@femo-uqfeu.mongodb.net/femo-db?retryWrites=true&w=majority";


mongoose.connect(mongoDB, { useNewUrlParser: true },
    function(err) {
        if (!err) {
            console.log("Connected to mongoDB");
        } else {
            console.log("Failed to connect to mongoDB: " + err);
        }
    }
);
