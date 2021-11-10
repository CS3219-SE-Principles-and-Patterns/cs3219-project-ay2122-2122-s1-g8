const Question = require("../models/question");
const Room = require("../models/room");
const User = require("../models/user");

const STATUS_CODE_OK = 200;
const STATUS_CODE_BAD_REQUEST = 400;
const STATUS_CODE_PARTIAL_CONTENT = 206;
const STATUS_CODE_NOT_FOUND = 404;

const question_post_create = (req, res) => {
  const question = new Question(req.body);
  question
    .save()
    .then((result) => {
      res.status(STATUS_CODE_OK).json({
        message: "Question successfully created",
        questionId: question._id,
      });
    })
    .catch((err) => {
      res.status(STATUS_CODE_PARTIAL_CONTENT).send(err);
    });
};

const question_put_update = (req, res) => {
  let id = req.params.id;
  let questionUpdates = req.body.content;
  Question.findById(id)
    .then((result) => {
      Object.assign(result, req.body.content)
        .save()
        .then((question) => {
          res.status(STATUS_CODE_OK).json({
            message: "Question updated",
            question: question.toJSON(),
          });
        })
        .catch((err) => {
          res.status(STATUS_CODE_BAD_REQUEST).send(err);
        });
    })
    .catch((err) => {
      res.status(STATUS_CODE_NOT_FOUND).json({
        message: "Question not found",
      });
    });
};

const question_get_details = (req, res) => {
  let room_id = req.params.id;
  Room.findById(room_id).then((room) => {
    let valid_questionID = room.questionID;

    Question.findById(valid_questionID)
      .then((result) => {
        res.status(STATUS_CODE_OK).json({
          message: "Question found",
          question: result.toJSON(),
        });
      })
      .catch((_) => {
        res.status(STATUS_CODE_NOT_FOUND).json({
          message: "Question not found",
          question: "",
        });
      });
  });
};

const question_get = (req, res) => {
  Question.findById(req.params.id)
    .then((result) => {
      res.status(STATUS_CODE_OK).json({
        message: "Question found",
        question: result.toJSON(),
      });
    })
    .catch((_) => {
      res.status(STATUS_CODE_NOT_FOUND).json({
        message: "Question not found",
        question: "",
      });
    });
};

const question_get_new = (req, res) => {
  let question_id = req.params.id;

  Question.findById(question_id)
    .then((result) => {
      Question.find().then((q_) => {
        const questions = [];
        let idx = -1;
        let len_push = 0;
        for (let i = 0; i < q_.length; i++) {
          if (q_[i].difficulty == result.difficulty) {
            questions.push(q_[i]);
            len_push += 1;
          }
          if (q_[i]._id == question_id) {
            idx = len_push - 1;
          }
        }
        if (idx == questions.length - 1) {
          idx = 0;
        } else {
          idx = idx + 1;
        }
        res.status(STATUS_CODE_OK).json({
          message: "Next question found",
          question: questions[idx].toJSON(),
        });
      });
    })
    .catch((_) => {
      res.status(STATUS_CODE_NOT_FOUND).json({
        message: "Question not found",
        question: "",
      });
    });
};

const question_delete = (req, res) => {
  const id = req.params.id;
  Question.findByIdAndDelete(id)
    .then((result) => {
      res.status(STATUS_CODE_OK).json({
        message: "Question deleted",
      });
    })
    .catch((err) => {
      res.status(STATUS_CODE_NOT_FOUND).json({
        message: "Question not found",
        error: err,
      });
    });
};

module.exports = {
  question_post_create,
  question_put_update,
  question_get_details,
  question_delete,
  question_get_new,
  question_get,
};
