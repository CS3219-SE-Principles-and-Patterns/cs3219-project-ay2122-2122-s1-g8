class Node{
    constructor(data){
        this.next = null;
        this.prev = null;
        this.data = data;
    }
}

Node.prototype.newDifficultyNode = function(username){
    return new Node({
        username: username
    })
}

class Queue{
    constructor(){
        this.head = null;
        this.length = 0;
        this.tail = null;
    }
    enqueue(node){
        if(!this.head){
            this.head = this.tail = node;
            this.length = 1;
        }
        else{
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
            this.length+=1;
        }
    }
    dequeue(){
        var poppedNode = null;
        if(this.length > 0){ 
            poppedNode = this.head;
            if(this.tail === this.head){
                this.tail = this.head = null;
            }
            else this.head = this.head.next;
            this.length-=1;
        }
        return poppedNode;
    }
}

function generateDifficultyQueue(){
    var qEasy = new Queue();
    var qMedium = new Queue();
    var qHard = new Queue();
    return {
        'Easy': qEasy, 
        'Medium': qMedium, 
        'Hard': qHard
    }
}

module.exports = {
    Node, Queue, generateDifficultyQueue
}