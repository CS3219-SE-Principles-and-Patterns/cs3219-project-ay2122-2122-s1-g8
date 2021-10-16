const io = require('socket.io')
const crypto = require('crypto')
const User = require('../models/user')

const STATUS_CODE_OK = 200;
const STATUS_CODE_NO_CONTENT = 204;
const STATUS_CODE_BAD_REQUEST = 400;
const STATUS_CODE_SERVER_ERROR = 500;
const STATUS_CODE_PARTIAL_CONTENT = 206;
const STATUS_CODE_NOT_FOUND = 404;
const difficultyLevel = ['Easy', 'Medium', 'Hard']
const statusLevel = ['Active', 'Offline', 'In Progress']

const match = (req, res) => {
    const timeLimit = 60000
    // check if the username exists
    var userid = null;

    // check if difficulty level exists
    if(typeof difficultyLevel !== 'undefined' && !difficultyLevel.includes(req.body.difficulty)){
        return res.status(STATUS_CODE_BAD_REQUEST).json({ message: "no such difficulty"})
    }

    User.findOne({username: req.body.username})
        .then(user => {
            if(user){
                userid = user._id;
                User.findByIdAndUpdate(userid, {"$set": {"questionDifficulty": req.body.difficulty}}, function(err, _){
                    if(err) return res.status(STATUS_CODE_SERVER_ERROR).json({ message: "Error occurred"});
                    peerMatch(req.body.username, req.body.difficulty).then(result => {
                        return res.status(STATUS_CODE_OK).json(result)
                    }).catch(err => {
                        console.log(err)
                        return res.status(STATUS_CODE_OK).json({ message: "no match"})
                    })
                })
            }
            else{
                return res.status(STATUS_CODE_BAD_REQUEST).json({ message: "no such username"})
            }
        })
        

    function peerMatch(username, difficulty){
        return new Promise((resolve, reject) => {
            var result = null;
            var timeout = setTimeout(() => {
                reject(result)
            }, timeLimit)
            
            while(result === null){
                // if system has found a match, but this occurs on the peer's end first
                User.findOne({"username": username}).then(res => {
                    if(!statusLevel.includes(res.status)){
                        // still need to find peerName from Room object, but not yet
                        result = {
                            roomId: res.status
                        }
                        clearTimeout(timeout)
                        resolve(result)
                    }
                })

                // else continue searching
                result = User.find({ 
                    $and: [
                        {"status": { $eq: "Active"}},
                        {"questionDifficulty": { $eq: difficulty }},
                        {"username": { $ne: username }}
                    ]   
                }).then(res => {
                    result = res[Math.floor(Math.random()*res.length)]
                    if(result !== undefined && result !== null){
                        
                        const roomId = createRoom(userid, result._id)

                        result = {
                            peerUserName: result.username,
                            roomId: roomId
                        }
                        clearTimeout(timeout)
                        resolve(result)
                    }
                })
            }
            
        });
    }

    
}

const createRoom = (userid_own, userid_peer) => {
    const roomId = crypto.randomBytes(10).toString('hex')
    User.findByIdAndUpdate(userid_peer, {"status": roomId}, function(err, doc){
        if(err) console.log(err);
    });
    User.findByIdAndUpdate(userid_own, {"status": roomId}, function(err, doc){
        if(err) console.log(err);
    });
    console.log("create room")

    return roomId;
}

const chat = (req, res) => {

}

module.exports = {
    match,
    chat
}