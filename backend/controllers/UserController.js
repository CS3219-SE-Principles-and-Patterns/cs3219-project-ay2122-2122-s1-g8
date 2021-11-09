const User = require('../models/user')
const {redisClient} = require('../db/index')

const updateStatus = (req, res, next) => {
    User.findOne({username: req.body.username})
    .then(user => {
        if(user){
            console.info(user);
            var myquery = {username: req.body.username};
            var newvalues = { $set: {status: "Offline"} };
            User.updateOne(myquery, newvalues, function(err, _) {
                if (err) throw err;
            })
            try{
                console.info(redisClient.srem("refreshTokens", req.body.refreshToken))
            }catch(e){}
            
            console.info("Update offline status done!");
            res.json({
                message: "Update offline status done!"
            })
        }else{
            res.json({
                message: "Coundn't find user!"
            })
        }
    })
}

const updateQuestionType = (req, res, next) => {
    User.findOne({username: req.body.username})
    .then(user => {
        if(user){
            console.info(user);
            var myquery = {username: req.body.username};
            var newvalues = { $set: {questionDifficulty: req.body.questionDifficulty} };
            User.updateOne(myquery, newvalues, function(err, _) {
                if (err) throw err;
            })
            res.json({
                message: "Update QType done!"
            })
        }else{
            res.json({
                message: "Coundn't update QType user!"
            })
        }
    })
}

module.exports = {
    updateStatus, updateQuestionType
};
