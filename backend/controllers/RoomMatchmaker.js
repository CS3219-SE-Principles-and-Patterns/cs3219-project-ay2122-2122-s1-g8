const crypto = require('crypto')
const {Node} = require('./structure/queue')

class QueueingManager{
    constructor(properties){
        this.properties = properties;
    }
    setEnqueueUser(username){
        this.properties.ENQUEUED_USER.add(username);
    }
    hasEnqueueUser(username){
        return this.properties.ENQUEUED_USER.has(username);
    }
    removeQueueUser(username){
        this.properties.ENQUEUED_USER.delete(username);
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
        if(!this.queuingManager.hasEnqueueUser(username)){
            this.queuingManager.setEnqueueUser(username);
            var newNode = Node.prototype.newDifficultyNode(username);
            this.addToDifficultyQueue(difficulty, newNode);
            return true;
        }
        else return false;
        
    }
    deleteUserRequest(username){
        this.queuingManager.removeQueueUser(username);
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
    forgetUser(username){
        this.queuingManager.removeQueueUser(username);
        this.matchPairingManager.removeFromDequeue(username);
    }
    findPeer(username, difficulty){
        do{
            if(this.isHeadOfQueue(username, difficulty)) return;
            var peer = this.removeFromDifficultyQueue(difficulty);
            if(peer && this.queuingManager.hasEnqueueUser(peer.data['username'])){
                const roomId = crypto.randomBytes(10).toString('hex');
                // create room not done here yet
                this.matchPairingManager.setDequeueUser(username, peer.data['username'], roomId);
                this.matchPairingManager.setDequeueUser(peer.data['username'], username, roomId);
                return peer;
            }
            else return
        }while(1);
    }
}

module.exports = {
    QueueingManager, MatchPairingManager, DataStoreManager
}