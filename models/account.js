let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let SALT_WORK_FACTOR = 10;
let Schema = mongoose.Schema;

let accountSchema = Schema({
    'email': {type: String, required: true, unique: true},
    'password': {type: String, required: true},
    'isVerified': {type: Boolean, default: false},
    'passwordResetToken': String,
    'passwordResetExpires': Date
});


/**
 * Reference: https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
 */
accountSchema.pre('save', function(next) {
    let account = this;

    // only hash the password if it has been modified (or is new)
    if (!account.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err)
            return next(err);

        // hash the password using our new salt
        bcrypt.hash(account.password, salt, function(err, hash) {
            if (err)
                return next(err);

            // override the cleartext password with the hashed one
            account.password = hash;
            next();
        });
    });
});

accountSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Account', accountSchema);
