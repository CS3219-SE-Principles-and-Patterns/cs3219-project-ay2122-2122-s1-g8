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
    if(typeof difficultyLevel !== 'undefined' && !difficultyLevel.includes(req.body.difficulty)){
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
                            return res.status(STATUS_CODE_OK).json({
                                roomId: extractRoomId(doc.status)
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
                })
                reject(result)
            }, timeLimit)
            

            const checkDatabase = setInterval(() => {
                User.findOne({"username": username}).then(res => {
                    const status = extractRoomId(res.status);
                    if(status !== null){
                        result = {
                            roomId: status
                        }
                        clearTimeout(timeout)
                        clearInterval(checkDatabase)
                        resolve(result)
                    }
                    else{
                        result = User.find({ 
                            $and: [
                                {"status": { $eq: "Matching"}},
                                {"questionDifficulty": { $eq: difficulty }},
                                {"username": { $ne: username }}
                            ]
                        }).then(res => {
                            // console.log("polling db")
                            if(res.length > 0){
                                // console.log("inside ")
                                let randomIndex = Math.floor(Math.random()*res.length)
                                peer = res[randomIndex]
                                const roomId = createRoom(userid, peer._id)
        
                                result = {
                                    roomId: roomId
                                }
                                clearTimeout(timeout)
                                clearInterval(checkDatabase)
                                resolve(result)
                            }
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })


                
            }, 500)

                // if system has found a match, but this occurs on the peer's end first
                

                // else continue searching
            
        });
    }

    
}

const createRoom = (userid_own, userid_peer) => {
    const roomId = crypto.randomBytes(10).toString('hex')
    User.findByIdAndUpdate(userid_peer, {"status": "Matched:" + roomId}, function(err, doc){
        if(err) console.log(err);
    });
    User.findByIdAndUpdate(userid_own, {"status": "Matched:" + roomId}, function(err, doc){
        if(err) console.log(err);
    });
    console.log("created room")

    return roomId;
}

const chat = (req, res) => {

}

module.exports = {
    match,
    chat
}