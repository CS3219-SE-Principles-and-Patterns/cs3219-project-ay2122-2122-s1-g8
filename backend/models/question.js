const mongoose = require('mongoose')
var Schema = mongoose.Schema;

questionSchema = Schema({
    questionStatement: String,
    sampleSolution: String,
    difficulty: String,
});

Question = mongoose.model('Question', questionSchema);
module.exports = Question;