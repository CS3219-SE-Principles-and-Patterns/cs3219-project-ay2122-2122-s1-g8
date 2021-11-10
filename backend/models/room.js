const mongoose = require('mongoose')
const User = require('./user')
const Schema = mongoose.Schema;

roomSchema = new Schema({
    usernames: [String],
    startTime: Date,
    endTime: Date,
    questionDifficulty: String,
    questionID: String,
    
});

Room = mongoose.model('Room', roomSchema)
module.exports = Room;