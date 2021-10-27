const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const redis = require('redis')
require('dotenv').config()

const redisClient = redis.createClient()

const register = (req, res, next) => {
    console.log("Register server running!");
    bcrypt.hash(req.body.password, 10, function(error, hashPassword){
        if(error){
            res.status(400).json({
                error: error
            })
        }
        User.findOne({$or: [{email: req.body.email}, {username: req.body.username}]})
        .then(user => {
            if(user){
                console.log(user);
                if (user.email == req.body.email){
                    res.status(200).json({
                        message: "Email exists!"
                    })
                }else{
                    res.status(200).json({
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
                    res.status(201).json({
                        message: "Successful registration!"
                    })
                })
                .catch(error => {
                    res.status(500).json({
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
                    // let token = jwt.sign({username: user.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3h'})
                    // generate token
                    let userJson = {username: user.username}
                    let token = generateAccessToken(userJson)
                    let refreshToken = jwt.sign(userJson, process.env.REFRESH_TOKEN_SECRET);
                    redisClient.sadd("refreshTokens", refreshToken);

                    // update database
                    var myquery = {$or: [{email: username}, {username: username}]};
                    var newvalues = { $set: {status: "Active"} };
                    var userID =  user.username;
                    User.updateOne(myquery, newvalues, function(err, _) {
                        if (err) throw err;
                    })

                    // send response
                    res.status(201).json({
                        message: 'Login successfully!',
                        token: token, 
                        refreshToken: refreshToken,
                        username: userID
                    })
                }else{
                    res.status(401).json({
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

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}

module.exports = {
    register, login
};
