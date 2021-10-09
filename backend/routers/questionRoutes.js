const express = require('express')
const router = express.Router()
const QuestionController = require('../controllers/QuestionController')

router.get('/:id', QuestionController.question_get_details);
router.post('/create', QuestionController.question_post_create);
router.put('/:id', QuestionController.question_put_update);
router.delete('/:id', QuestionController.question_delete);

module.exports = router;