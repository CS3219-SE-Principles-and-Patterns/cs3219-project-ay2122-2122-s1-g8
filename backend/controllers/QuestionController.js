const Question = require('../models/question')
const Room = require('../models/room')
const User = require('../models/user')

const STATUS_CODE_OK = 200;
const STATUS_CODE_BAD_REQUEST = 400;
const STATUS_CODE_PARTIAL_CONTENT = 206;
const STATUS_CODE_NOT_FOUND = 404;

const question_post_create = (req, res) => {
    const question = new Question(req.body)
    question.save()
        .then((result) => {
            res.status(STATUS_CODE_OK).json({
                message: 'Question successfully created',
                questionId: question._id
            })
        })
        .catch(err => {
            res.status(STATUS_CODE_PARTIAL_CONTENT).send(err);
        })
}

const question_put_update = (req, res) => {
    let id = req.params.id;
    let questionUpdates = req.body.content;
    Question.findById(id)
        .then(result => {
            Object.assign(result, req.body.content).save()
                .then(question => {
                    res.status(STATUS_CODE_OK).json({
                        message: "Question updated",
                        question: question.toJSON()
                    })
                })
                .catch(err => {
                    res.status(STATUS_CODE_BAD_REQUEST).send(err);
                })
            })
        .catch(err => {
            res.status(STATUS_CODE_NOT_FOUND).json({
                message: "Question not found"
            })
        });
};

const question_get_details = (req, res) => {
    let zoom_id = req.params.id;
    console.log(zoom_id);

    Room.findOne({roomId: zoom_id}).then(room => {
        let user1 = room.usernames[0];
        let user2 = room.usernames[1];
        let difficulty = room.questionDifficulty;

        Room.find().then(room_ => {
            let attempted_user_1 = new Set();
            let attempted_user_2 = new Set();
            for (let i=0; i<room_.length; i++){
                if(room_[i].usernames[0] == user1 || room_[i].usernames[1] == user1){
                    if(room_[i].questionID){
                        attempted_user_1.add(room_[i].questionID);
                    }
                }
                if(room_[i].usernames[0] == user2 || room_[i].usernames[1] == user2){
                    if(room_[i].questionID){
                        attempted_user_2.add(room_[i].questionID);
                    }
                }
            }

            Question.find().then(question => {
                let valid_questionID;
                for(let i = 0; i<question.length; i++){
                    if(!attempted_user_1.has(question[i]._id.toString()) && !attempted_user_2.has(question[i]._id.toString()) && difficulty == question[i].difficulty){
                        valid_questionID = question[i]._id.toString();
                    }
                }
                if(!valid_questionID){
                    console.log("User tried all available questions");
                    return;
                }

                Question.findById(valid_questionID)
                .then(result => {
                    res.status(STATUS_CODE_OK).json({
                        message: "Question found",
                        question: result.toJSON()
                    })
                })
                .catch(_ => {
                    res.status(STATUS_CODE_NOT_FOUND).json({
                        message: "Question not found",
                        question: ""
                    })
                })
            });
        });
    });
}

const question_delete = (req, res) => {
    const id = req.params.id;
    Question.findByIdAndDelete(id)
        .then(result => {
            res.status(STATUS_CODE_OK).json({
                message: "Question deleted"
            })
        })
        .catch(err => {
            res.status(STATUS_CODE_NOT_FOUND).json({
                message: "Question not found",
                error: err
            })
        })
}

module.exports = {
    question_post_create,
    question_put_update,
    question_get_details,
    question_delete,
}