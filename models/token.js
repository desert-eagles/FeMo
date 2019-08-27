let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let tokenSchema = Schema({
    _accountId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Account'},
    token: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now, expires: 43200}
});

module.exports = mongoose.model('Token', tokenSchema);
