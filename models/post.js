let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let postSchema = Schema({
    _user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    title: {type: String, required: true},
    description: String,
    urls: {type: [String]},
    createdAt: {type: Date, required: true, default: Date.now},
    date: Date
});


module.exports = mongoose.model('Post', postSchema);
