const mongoose = require('mongoose')
const User = require('./user')
const Schema = mongoose.Schema;

roomSchema = new Schema({
    userIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    startTime: Date,
    endtime: Date,
    questionDifficulty: String,
});

Room = mongoose.Model('Room', roomSchema)
module.exports = Room;