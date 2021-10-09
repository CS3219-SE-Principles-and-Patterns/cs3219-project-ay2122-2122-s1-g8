const Question = require("../models/question");

const question_post_create = (req, res) => {
  const question = new Question(req.body);
  question
    .save()
    .then((result) => {
      res.json({
        message: "Question successfully created",
        questionId: question._id,
      });
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
};

const question_post_update = (req, res) => {
  let id = req.params.id;
  let questionUpdates = req.body.content;
  Question.findOneAndUpdate(id, questionUpdates, { returnOriginal: false })
    .then((result) => {
      res.json({
        message: "Question successfully updated",
        question: result.toJSON(),
      });
    })
    .catch((err) => {
      res.json({
        message: "Question not updated",
        error: err,
      });
    });
};

const question_get_details = (req, res) => {
  let id = req.params.id;
  Question.findById(id)
    .then((result) => {
      res.json({
        message: "Question found",
        question: result.toJSON(),
      });
    })
    .catch((err) => {
      res.json({
        message: "Question not found",
        question: "",
      });
    });
};

const question_delete = (req, res) => {
  const id = req.params.id;
  Question.findByIdAndDelete(id)
    .then((result) => {
      res.json({
        message: "Question deleted",
      });
    })
    .catch((err) => {
      res.json({
        message: "Error when deleting question",
        error: err,
      });
    });
};

module.exports = {
  question_post_create,
  question_post_update,
  question_get_details,
  question_delete,
};
