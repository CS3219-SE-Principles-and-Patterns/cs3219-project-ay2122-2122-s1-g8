const mongoose = require('mongoose')
var Schema = mongoose.Schema;

questionSchema = Schema({
    questionStatement: {
        type: String,
        required: true
    },
    sampleSolution: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    }
});

Question = mongoose.model('Question', questionSchema);
module.exports = Question;