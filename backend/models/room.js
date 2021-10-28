const mongoose = require('mongoose')
const User = require('./user')
const Schema = mongoose.Schema;

roomSchema = new Schema({
    // userIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    usernames: [String],
    startTime: Date,
    endTime: Date,
    questionDifficulty: String,
    questionID: String,
    // list of questionId
    
});

Room = mongoose.model('Room', roomSchema)
module.exports = Room;