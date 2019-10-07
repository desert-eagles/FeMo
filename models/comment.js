/**
 * Defining Comment collection in MongoDB
 * Stores comment strings and reference to User and Post entries
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = Schema({
    _userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    _postId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post'},
    description: String,
    commentedAt: {type: Date, required: true, default: Date.now}
});


module.exports = mongoose.model('Comment', commentSchema);
