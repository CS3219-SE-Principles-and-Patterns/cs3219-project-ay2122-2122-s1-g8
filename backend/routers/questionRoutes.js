const authenticateToken = require('../middleware/auth')
const express = require("express");
const router = express.Router();
const QuestionController = require("../controllers/QuestionController");

router.get('/new/:id', authenticateToken, QuestionController.question_get_new);
router.get('/:id', authenticateToken, QuestionController.question_get_details);
router.post('/create', authenticateToken, QuestionController.question_post_create);
router.put('/:id', authenticateToken, QuestionController.question_put_update);
router.delete('/:id', authenticateToken, QuestionController.question_delete);

module.exports = router;
