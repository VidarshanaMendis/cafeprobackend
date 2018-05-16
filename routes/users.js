const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

//register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
//adding the user to the database, invoking the encrypting functionality
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({success: false, msg: 'failed to register'})
        } else {
            res.json({success: true, msg: ' registered'})
        }
    });
});


router.post('/updatedetails', (req, res, next) => {
    console.log("updatedetails called");

    User.updateDetails(req, (err, user) => {
        console.log(req.body);
        console.log("/updatedetails called");
        if (err) {
            res.json({success: false, msg: 'failed to update'})
        } else {
            res.json({success: true, msg: ' updated'})
        }
    });
});

//sending a post request to authenticate by username and password
router.post('/authenticate', (req, res, next) => {
    console.log("/authenticate called");
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: "user not found"});
            console.log("user not found");
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            //compare with the encrypted password
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({data: user}, config.secret, {  //create the token
                    expiresIn: 604800

                });
                //response to the front-end
                res.json({
                    success: true,
                    token: "JWT " + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg: "wrong password"});
                console.log("wrong password");

            }

        });
    });

});

//profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});


module.exports = router;