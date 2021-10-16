const io = require('socket.io')
const crypto = require('crypto')
const User = require('../models/user')

const STATUS_CODE_OK = 200;
const STATUS_CODE_NO_CONTENT = 204;
const STATUS_CODE_BAD_REQUEST = 400;
const STATUS_CODE_PARTIAL_CONTENT = 206;
const STATUS_CODE_NOT_FOUND = 404;

const match = (req, res) => {
    const timeLimit = 10000
    function peerMatch(username, difficulty){
        return new Promise((resolve, reject) => {
            var result = null;
            var timeout = setTimeout(() => {
                reject(result)
            }, timeLimit)

            while(result === null){
                result = User.findOne({ 
                    $and: [
                        {"status": { $eq: "Active"}},
                        {"questionDifficulty": { $eq: difficulty }},
                        {"username": { $ne: username }}
                    ]   
                }).then(res => {
                    result = res;
                    if(result !== null){
                        const roomId = crypto.randomBytes(10).toString('hex');
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

    peerMatch(req.body.username, req.body.difficulty).then(result => {
        res.status(STATUS_CODE_OK).json(result)
    }).catch(err => {
        res.status(STATUS_CODE_OK).json({ message: "no match"})
    })
}

const chat = (req, res) => {

}

module.exports = {
    match,
    chat
}