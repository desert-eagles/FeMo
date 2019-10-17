/**
 * Defining Request collection in MongoDB
 * Store family member request between users
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let requestSchema = Schema({
    _relationshipIds: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Relationship'}],
    _senderId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    _receiverId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    accepted: {type: Boolean, default: false}
});

module.exports = mongoose.model('Request', requestSchema);
