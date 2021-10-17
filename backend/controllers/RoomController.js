const Matchmaking = require('./RoomMatchmaker')
const User = require('../models/user')

const STATUS_CODE_OK = 200;
const STATUS_CODE_NOT_FOUND = 404;

const new_peer_request = (req, res, roomManager, properties) => {
    const username = req.body.username;
    const difficulty = req.body.difficulty;

    var peerFound = roomManager.matchPairingManager.hasDequeue(username);
    var inQueue = roomManager.queuingManager.hasEnqueueUser(username);
    if(peerFound){
        return res.status(STATUS_CODE_OK).json({
            "message": "Already found a match",
            peerFound
        })
    }
    else if(inQueue){
        return res.status(STATUS_CODE_OK).json({
            "message": "Already in queue"
        })
    }
    else{
        var peer = roomManager.findPeer(username, difficulty);
        if(peer){
            return res.status(STATUS_CODE_OK).json({
                "message": "Match found. Call again with /status endpoint"
            })
        }
        else{
            roomManager.createNewRequest(username, difficulty);
            return res.status(STATUS_CODE_OK).json({
                "message": `Enqueued ${username}`
            })
        }
    }

}

const match_status_query = (req, res, roomManager, properties) => {
    const username = req.body.username;
    var hasMatch = roomManager.matchPairingManager.hasDequeue(username);
    var wasQueued = roomManager.queuingManager.hasEnqueueUser(username);

    if(hasMatch){
        return res.status(STATUS_CODE_OK).json({
            hasMatch
        })
    }
    else if(!wasQueued){
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

const drop_request_query = (req, res, roomManager, properties) => {
    const username = req.body.username;

    if(roomManager.queuingManager.hasEnqueueUser(username)){
        roomManager.forgetUser(username);
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