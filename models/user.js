let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = Schema({
    _accountId: {type: mongoose.Schema.Types.ObjectId, ref: 'Account', unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    dob: {type: Date, required: true},
    nickname: {type: String, required: true},
    posts: {type: [mongoose.Schema.Types.ObjectId], ref: 'Post'}
});


module.exports = mongoose.model('User', userSchema);
