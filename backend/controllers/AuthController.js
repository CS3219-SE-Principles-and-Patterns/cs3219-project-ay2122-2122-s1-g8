const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = (req, res, next) => {
    console.log("Register server running!");
    bcrypt.hash(req.body.password, 10, function(error, hashPassword){
        if(error){
            res.json({
                error: error
            })
        }
        User.findOne({$or: [{email: req.body.email}, {username: req.body.username}]})
        .then(user => {
            if(user){
                console.log(user);
                if (user.email == req.body.email){
                    res.json({
                        message: "Email exists!"
                    })
                }else{
                    res.json({
                        message: "User exists!"
                    })
                }
            }else{
                let user = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashPassword
                })
                user.save()
                .then(user => {
                    res.json({
                        message: "Successful registration!"
                    })
                })
                .catch(error => {
                    res.json({
                        message: "Registration unsuccessful!"
                    })
                })
            }
        })
    })
}

const login = (req, res, next) => {
    console.log("Login server running!");
    var username = req.body.username
    var password = req.body.password
    console.log(username);
    console.log(password);

    User.findOne({$or: [{email: username}, {username: username}]})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(error, result){
                if(error){
                    res.json({
                        error: error
                    })
                }
                if(result){
                    let token = jwt.sign({username: user.username}, 'verySecreteValue', {expiresIn: '3h'})
                    var myquery = {$or: [{email: username}, {username: username}]};
                    var newvalues = { $set: {status: "Active"} };
                    var userID =  user.username;
                    User.updateOne(myquery, newvalues, function(err, _) {
                        if (err) throw err;
                    })
                    res.json({
                        message: 'Login successfully!',
                        token: token, 
                        username: userID
                    })
                }else{
                    res.json({
                        message: 'Wrong password!'
                    })
                }
            })
        }else{
            res.json({
                message: 'No user found!'
            })
        }
    })
}

module.exports = {
    register, login
};
