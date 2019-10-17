/**
 * Defining User collection in MongoDB
 * Stores user details and posts
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');


let userSchema = Schema({
    _accountId: {type: mongoose.Schema.Types.ObjectId, ref: 'Account', unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    pic_url: {type: String, default: "/images/default-profile-picture.png"},
    pic_id: String,
    gender: {type: String, enum: ['Male', 'Female'], require: true},
    dob: {type: Date, required: true},
    nickname: {type: String, required: true},
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    requests: [{type: mongoose.Schema.Types.ObjectId, ref: 'Request'}],
    connections: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

userSchema.plugin(mongoose_fuzzy_searching, {fields: ['firstname', 'lastname', 'nickname']});

module.exports = mongoose.model('User', userSchema);
