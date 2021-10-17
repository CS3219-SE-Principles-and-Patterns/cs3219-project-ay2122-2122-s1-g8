const router = require('express').Router()
const roomMatchMaker = require('../controllers/RoomMatchmaker')
const roomController = require('../controllers/RoomController')

function getRoomController(properties){
    var q_manager = new roomMatchMaker.QueueingManager(properties);
    var mm_manager = new roomMatchMaker.MatchPairingManager(properties);
    var ds_manager = new roomMatchMaker.DataStoreManager(properties, q_manager, mm_manager);
    return ds_manager;
}

function roomRouter(properties){
    var dsManager = getRoomController(properties)
    router.post('/new', (req, res) => roomController.new_peer_request(req, res, dsManager, properties));
    router.post('/status', (req, res) => roomController.match_status_query(req, res, dsManager, properties));
    router.post('/drop', (req, res) => roomController.drop_request_query(req, res, dsManager, properties));
    // router.get('/room/:id', roomController.chat);   // may need to relocate this because now url is /api/match/room/:id instead of /api/room/:id
    
    return router;
}


module.exports = roomRouter