/**
 * Defining Relationship collection in MongoDB
 * Stores relationship between two users
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let relationshipSchema = Schema({
    from: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    to: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    relationship: String
});

module.exports = mongoose.model('Relationship', relationshipSchema);
