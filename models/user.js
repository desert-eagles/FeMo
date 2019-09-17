let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = Schema({
    _accountId: {type: mongoose.Schema.Types.ObjectId, ref: 'Account', unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    pic_url: {type: String, default: "/images/default-profile-picture.png"},
    pic_id: String,
    gender: {type: String, enum: ['Male', 'Female'], require: true},
    dob: {type: Date, required: true},
    nickname: {type: String, required: true},
    posts: {type: [mongoose.Schema.Types.ObjectId], ref: 'Post'}
});


module.exports = mongoose.model('User', userSchema);
