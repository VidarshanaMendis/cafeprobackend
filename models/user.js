const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//user schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },

    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

//get user by ID
module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

//get user by name
module.exports.getUserByUsername = function (username, callback) {
    const query = {username: username}
    User.findOne(query, callback);

}

//hashing the password with salt and bcrypt
module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}

module.exports.updateDetails = function (data,callback){

    User.findById(data.body._id, function (err, user) {
        if (err) {
            res.send({error: err});
        }

        user.set(
            {
                name: data.body.name,
                username:data.body.username,
                email:data.body.email

            }
        );
        user.save(callback);
        //console.log("details updated");
    });
};