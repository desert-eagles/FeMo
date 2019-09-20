let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let postSchema = Schema({
    _userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    description: String,
    pic_urls: {type: [String]},
    pic_ids: {type: [String]},
    like: {type: [mongoose.SchemaTypes.ObjectId], ref: 'User', default: []},
    createdAt: {type: Date, required: true, default: Date.now},
    occurredAt: Date
});


module.exports = mongoose.model('Post', postSchema);
