// Inspiration and initial guidance from https://github.com/jduyon/matchmaking
const User = require('../models/user')
const Room = require('../models/room')

const STATUS_CODE_OK = 200;
const STATUS_CODE_NOT_FOUND = 404;
const STATUS_CODE_SERVER_ERROR = 500;
const DIFFICULTY_LIST = ['Easy', 'Medium', 'Hard']

const new_peer_request = (req, res, roomManager) => {
    const username = req.body.username;
    const difficulty = req.body.difficulty;

    if(!DIFFICULTY_LIST.includes(difficulty)){
        return res.status(STATUS_CODE_NOT_FOUND).json({
            "message": "No such difficulty"
        })
    }

    // check if user exists
    User.findOne({username: username}).then(async doc => {
        if(!doc){
            return res.status(STATUS_CODE_NOT_FOUND).json({
                "message": "No such user"
            })    
        }
        var peerFound = roomManager.matchPairingManager.hasDequeue(username);
        var inQueue = roomManager.queuingManager.hasEnqueueUser(username, difficulty);
        if(peerFound){  // check if already found match
            return res.status(STATUS_CODE_OK).json({
                "message": "Already found a match",
                peerName: peerFound.peerName,
                roomId: peerFound.roomId
            })
        }
        else if(inQueue){   // check if in queue, ie still matching
            return res.status(STATUS_CODE_OK).json({
                "message": "Already in queue"
            })
        }
        else{
            var peer = await roomManager.findPeer(username, difficulty);
            if(peer){   // try finding a match without enqueuing it
                var hasMatch = roomManager.matchPairingManager.hasDequeue(username);

                let user1 = username;
                let user2 = peer.data['username'];
        
                Room.find().then(room_ => {
                    let attempted_user_1 = new Set();
                    let attempted_user_2 = new Set();
                    for (let i=0; i<room_.length; i++){
                        if(room_[i].usernames[0] == user1 || room_[i].usernames[1] == user1){
                            if(room_[i].questionID){
                                attempted_user_1.add(room_[i].questionID);
                            }
                        }
                        if(room_[i].usernames[0] == user2 || room_[i].usernames[1] == user2){
                            if(room_[i].questionID){
                                attempted_user_2.add(room_[i].questionID);
                            }
                        }
                    }
                    
                    console.log("Debug users");
                    console.log(user1);
                    console.log(user2);
                    console.log("Debug users");
                    
                    Question.find().then(question => {
                        let valid_questionID;
                        for(let i = 0; i<question.length; i++){
                            if(!attempted_user_1.has(question[i]._id.toString()) && !attempted_user_2.has(question[i]._id.toString()) && difficulty == question[i].difficulty){
                                valid_questionID = question[i]._id.toString();
                            }
                        }
                        if(!valid_questionID){
                            console.log("User tried all available questions");
                            return;
                        }
                        else{
                            console.log("Debug question ID");
                            console.log(valid_questionID);
                            console.log("Debug question ID");
                            Room.findByIdAndUpdate(hasMatch.roomId, {$set: {questionID: valid_questionID}}, function(err, doc){
                                if(!err){
                                    console.log("found")
                                    return res.status(STATUS_CODE_OK).json({
                                        "message": "Match found. Call again with /status endpoint"
                                    })
                                }
                                else{
                                    return res.status(STATUS_CODE_SERVER_ERROR).json({
                                        "message": "Database is not available at the moment"
                                    })
                                }
                            })
                        }
                    });
                });
            }
            else{      // no match found, so enqueue this user
                roomManager.createNewRequest(username, difficulty);
                return res.status(STATUS_CODE_OK).json({
                    "message": `Enqueued ${username}`
                })
            }
        }
    }).catch(err => {
        console.log(err)
        return res.status(STATUS_CODE_SERVER_ERROR).json({
            "message": err
        })
    })

}

const match_status_query = (req, res, roomManager) => {
    const username = req.body.username;
    const difficulty = req.body.difficulty;
    var hasMatch = roomManager.matchPairingManager.hasDequeue(username);
    var wasQueued = roomManager.queuingManager.hasEnqueueUser(username, difficulty);

    if(!DIFFICULTY_LIST.includes(difficulty)){
        return res.status(STATUS_CODE_NOT_FOUND).json({
            "message": "No such difficulty"
        })
    }

    if(hasMatch){   // check if found a match
        return res.status(STATUS_CODE_OK).json({
            peerName: hasMatch.peerName,
            roomId: hasMatch.roomId
        })
    }
    else if(!wasQueued){    // check if user exists AND is in queue. Only checks 2nd condition because 2nd condition exists iff new_peer_request is made
        return res.status(STATUS_CODE_NOT_FOUND).json({
            "message": "Username not enqueued. Should first enqueue with /new endpoint"
        })
    }
    else{
        return res.status(202).json({
            "message": "Still matching"
        })
    }
}

// Call to remove user from matching service. Frontend calls it after it thinks matching time is too long
const drop_request_query = (req, res, roomManager) => {
    const username = req.body.username;
    const difficulty = req.body.difficulty;
    
    if(!DIFFICULTY_LIST.includes(difficulty)){
        return res.status(STATUS_CODE_NOT_FOUND).json({
            "message": "No such difficulty"
        })
    }
    // User cancels request: when match has just occurred
    let alreadyMatch = roomManager.matchPairingManager.hasDequeue(username);
    if(alreadyMatch){
        const roomId = alreadyMatch.roomId;
        Room.findByIdAndDelete(roomId)
            .then(doc => {
                roomManager.deleteUserRequest(username, difficulty);
                roomManager.matchPairingManager.removeFromDequeue(alreadyMatch.peerName);
                
                // while user A drops, try find another match for user B, since matching only occurs when /new is invoked
                roomManager.findPeer(alreadyMatch.peerName, difficulty);

                return res.status(STATUS_CODE_OK).json({
                    "message": "Match found, but successfully deleted"
                })
            })
            .catch(err => {
                console.log("error is ", err);
                return res.state(STATUS_CODE_SERVER_ERROR).json({
                    "message": "Error occurred on server"
                })
            })
    }
    // Timeout flow: frontend calls this endpoint when match timeout happens -- no successful matches
    else if(roomManager.queuingManager.hasEnqueueUser(username, difficulty)){
        roomManager.deleteUserRequest(username, difficulty);
        return res.status(STATUS_CODE_OK).json({
            "message": "Removed user from matching service"
        })
    }
    else{
        return res.status(STATUS_CODE_NOT_FOUND).json({
            "message": "User originally not found in matching queue"
        })
    }
}

module.exports = {
    new_peer_request, match_status_query, drop_request_query
}