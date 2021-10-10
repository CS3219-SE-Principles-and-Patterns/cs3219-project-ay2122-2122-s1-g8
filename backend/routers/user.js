const express = require('express')
const router = express.Router()

const UserController = require('../controllers/UserController')

router.post('/updateStatus', UserController.updateStatus);
router.post('/updateQuestionType', UserController.updateQuestionType);

module.exports = router