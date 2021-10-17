var queue = require('./structure/queue')

var ENQUEUED_USER = generateEnqueueSet()
var DEQUEUED_USER = {}  // user_id: {peer_user_id, roomId}
var DIFFICULTY_QUEUES = queue.generateDifficultyQueue()

var PROPERTIES = {
    ENQUEUED_USER, DEQUEUED_USER, DIFFICULTY_QUEUES
}

function generateEnqueueSet(){
    return {
        "Easy": new Set(),
        "Medium": new Set(),
        "Hard": new Set()
    }
}

module.exports = PROPERTIES;
