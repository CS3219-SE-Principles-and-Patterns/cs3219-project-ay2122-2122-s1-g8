const Room = require('../models/room')
const {Node} = require('./structure/queue')

class QueueingManager{
    constructor(properties){
        this.properties = properties;
    }
    setEnqueueUser(username, difficulty){
        this.properties.ENQUEUED_USER[difficulty].add(username);
    }
    hasEnqueueUser(username, difficulty){
        return this.properties.ENQUEUED_USER[difficulty].has(username);
    }
    removeQueueUser(username, difficulty){
        this.properties.ENQUEUED_USER[difficulty].delete(username);
    }
}

class MatchPairingManager{
    constructor(properties){
        this.properties = properties;
    }
    setDequeueUser(username, peerUsername, roomId){
        this.properties.DEQUEUED_USER[username] = {
            peerName: peerUsername,
            roomId: roomId
        }
    }
    hasDequeue(username){
        return this.properties.DEQUEUED_USER[username];
    }
    removeFromDequeue(username){
        delete this.properties.DEQUEUED_USER[username];
    }
}

class DataStoreManager{
    constructor(properties, queuingManager, matchPairingManager){
        this.properties = properties;
        this.queuingManager = queuingManager;
        this.matchPairingManager = matchPairingManager;
    }
    createNewRequest(username, difficulty){
        // to create new request, this req must be his first req AND he has not found a match but quickly requests for a new request /
        // (since then he would be in DEQUEUED_USER instead of ENQUEUE)
        if(!this.queuingManager.hasEnqueueUser(username, difficulty) && !this.properties.DEQUEUED_USER[username]){
            this.queuingManager.setEnqueueUser(username, difficulty);
            var newNode = Node.prototype.newDifficultyNode(username);
            this.addToDifficultyQueue(difficulty, newNode);
            return true;
        }
        else return false;
    }
    deleteUserRequest(username, difficulty){
        // not removing him in each DIFFICULTY_QUEUE, but this will not affect the correctness because in peerMatch(), will check // /
        // whether user has already dropped request. Such mechanism improves efficiency
        this.queuingManager.removeQueueUser(username, difficulty);
        this.matchPairingManager.removeFromDequeue(username);
    }
    getQueueHead(difficulty){
        return this.properties.DIFFICULTY_QUEUES[difficulty].head;
    }
    removeFromDifficultyQueue(difficulty){
        return this.properties.DIFFICULTY_QUEUES[difficulty].dequeue();
    }
    addToDifficultyQueue(difficulty, newNode){
        this.properties.DIFFICULTY_QUEUES[difficulty].enqueue(newNode);
    }
    isHeadOfQueue(username, difficulty){
        let q = this.getQueueHead(difficulty);
        if(q && q.data.username === username) return true;
        return false;   
    }
    async findPeer(username, difficulty){
        do{
            if(this.isHeadOfQueue(username, difficulty)) return;
            const peer = this.removeFromDifficultyQueue(difficulty);
            if(peer && this.queuingManager.hasEnqueueUser(peer.data['username'], difficulty) && !this.matchPairingManager.hasDequeue(peer.data['username'])){
                const newRoom = new Room({
                    usernames: [username, peer.data['username']],
                    startTime: new Date(),
                    questionDifficulty: difficulty,
                })
                var peerResult = await newRoom.save()
                    .then((result) => {
                        let roomId = result._id;
                        this.matchPairingManager.setDequeueUser(username, peer.data['username'], roomId);
                        this.matchPairingManager.setDequeueUser(peer.data['username'], username, roomId);
                        return peer;
                    })
                    .catch(err => {
                        console.log(err)
                        return;
                    })
                return peerResult;
            }
        }while(this.getQueueHead(difficulty) !== null);
    }
}

module.exports = {
    QueueingManager, MatchPairingManager, DataStoreManager
}