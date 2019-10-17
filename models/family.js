/**
 * Defining Family collection in MongoDB
 * Stores family group
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let familySchema = Schema({
    name: {type: String, required: true},
    description: String,
    pic_url: {type: String, default: "/images/default-family-picture.png"},
    pic_id: String,
    creator: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    createdAt: {type: Date, required: true, default: Date.now}
});


module.exports = mongoose.model('Family', familySchema);
