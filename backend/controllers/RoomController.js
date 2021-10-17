// Inspiration and initial guidance from https://github.com/jduyon/matchmaking
const User = require('../models/user')

const STATUS_CODE_OK = 200;
const STATUS_CODE_NOT_FOUND = 404;
const STATUS_CODE_SERVER_ERROR = 500;
const DIFFICULTY_LIST = ['Easy', 'Medium', 'Hard']

const new_peer_request = (req, res, roomManager, properties) => {
    const username = req.body.username;
    const difficulty = req.body.difficulty;

    if(!DIFFICULTY_LIST.includes(difficulty)){
        return res.status(STATUS_CODE_NOT_FOUND).json({
            "message": "No such difficulty"
        })
    }

    // check if user exists
    User.findOne({username: username}).then(doc => {
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
            var peer = roomManager.findPeer(username, difficulty);
            if(peer){   // try finding a match without enqueuing it
                return res.status(STATUS_CODE_OK).json({
                    "message": "Match found. Call again with /status endpoint"
                })
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

const match_status_query = (req, res, roomManager, properties) => {
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
const drop_request_query = (req, res, roomManager, properties) => {
    const username = req.body.username;
    const difficulty = req.body.difficulty;
    
    if(!DIFFICULTY_LIST.includes(difficulty)){
        return res.status(STATUS_CODE_NOT_FOUND).json({
            "message": "No such difficulty"
        })
    }

    if(roomManager.queuingManager.hasEnqueueUser(username, difficulty)){
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