const io = require('socket.io')
const crypto = require('crypto')
const User = require('../models/user')

const STATUS_CODE_OK = 200;
const STATUS_CODE_BAD_REQUEST = 400;
const STATUS_CODE_SERVER_ERROR = 500;
const difficultyLevel = ['Easy', 'Medium', 'Hard']

function extractRoomId(rawStatusString){
    var patternStatus = new RegExp(/^Matched:(.*)/);
    const status = rawStatusString.match(patternStatus);
    if(status !== null) return status[1]
    else return null
}

const match = (req, res) => {
    const timeLimit = 10000
    // check if the username exists
    var userid = null;

    // check if difficulty level exists
    if(typeof difficultyLevel === 'undefined' || !difficultyLevel.includes(req.body.difficulty)){
        return res.status(STATUS_CODE_BAD_REQUEST).json({ message: "no such difficulty"})
    }

    User.findOne({username: req.body.username})
        .then(user => {
            if(user){
                userid = user._id;
                User.findByIdAndUpdate(userid, {"$set": {"questionDifficulty": req.body.difficulty, "status": "Matching"}}, function(err, _){
                    if(err) return res.status(STATUS_CODE_SERVER_ERROR).json({ message: "Error occurred"});
                    peerMatch(req.body.username, req.body.difficulty).then(result => {
                        User.findOne({"username": req.body.username}).then(doc => {
                            var roomId = extractRoomId(doc.status);
                            if(roomId === null) roomId = result.roomId
                            return res.status(STATUS_CODE_OK).json({
                                roomId: roomId
                            })
                        })
                    }).catch(err => {
                        console.log("err is " + err)
                        return res.status(STATUS_CODE_OK).json({ roomId: ""})
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
                clearInterval(checkDatabase)
                User.findOneAndUpdate({"username": username}, {"status": "Active"}, function(err, doc){
                    if(err) console.log(err);
                });
                reject(result);
            }, timeLimit)
            
    
            const checkDatabase = setInterval(() => {
                result = User.find({ 
                    $and: [
                        {"status": { $eq: "Matching"}},
                        {"questionDifficulty": { $eq: difficulty }},
                        {"username": { $ne: username }}
                    ]
                }).then(async res => {
                    if(res.length > 0){
                        clearTimeout(timeout)
                        clearInterval(checkDatabase)
    
                        let randomIndex = Math.floor(Math.random()*res.length)
                        peer = res[randomIndex]
                        const roomId = await createRoom(userid, peer._id)
                        
                        result = {
                            roomId: roomId
                        }
                        resolve(result)
                    }
                })
    
                
            }, 500)
            
        });
    }
}



const createRoom = async (userid_own, userid_peer) => {
    console.log("in createRoom")
    return new Promise((resolve, reject) => {
        
        User.findById(userid_own).then(res => {
            var roomId = extractRoomId(res.status);
            if(roomId !== null) resolve(roomId);
    
            roomId = crypto.randomBytes(10).toString('hex')
            User.findByIdAndUpdate(userid_peer, {"status": "Matched:" + roomId}, function(err, doc){
                if(err) reject(err);
                else{
                    User.findByIdAndUpdate(userid_own, {"status": "Matched:" + roomId}, function(err, doc){
                        if(err) reject(err);
                        else resolve(roomId);
                    });
                }
            });
        })
    })
}

const chat = (req, res) => {

}

module.exports = {
    match,
    chat
}