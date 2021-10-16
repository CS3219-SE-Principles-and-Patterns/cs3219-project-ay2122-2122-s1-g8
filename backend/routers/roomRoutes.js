const express = require('express')
const router = express.Router()

const roomController = require('../controllers/RoomController')

router.post('/match', roomController.match);    // post user id to start finding a match. Returns another person's id and the new room's url
router.get('/chat', roomController.chat);  // exposes socket.io endpoint

module.exports = router