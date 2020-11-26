var mongoose = require('mongoose');
var crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    userName: { type: String, unique: true, index: true },
    email: { type: String, unique: true, index: true },
    HashedPassword: { type: String, required: true },
    salt: String,
    role: {
        type: String,
        default: 0
    }
});

UserSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.HashedPassword = this.encryptPassword(password)
    })
    .get(function () {
        this._password
    });

UserSchema.methods = {
    authenticated: function (passwordPlain) {
        return this.encryptPassword(passwordPlain) == this.HashedPassword
    },
    encryptPassword: function (password) {
        if (!password) return ' ';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        } catch (error) {
            return '';
        }
    },
    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
};

module.exports = mongoose.model('User', UserSchema);