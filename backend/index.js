const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const config = require('config')
const http = require('http')

const db = require("./db");
const AuthRouter = require("./routers/auth");
const QuestionRouter = require("./routers/questionRoutes");
const Usr = require("./routers/user");
const RoomRouter = require("./routers/roomRoutes")
const roomProperties = require("./controllers/roomProperties")

// create app
const app = express()
const apiPort = process.env.PORT || 3030
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
})

// add middleware
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())

// add endpoints
app.use('/api', AuthRouter)
app.use('/api', Usr)
app.use('/api/match', RoomRouter(roomProperties));
app.use('/api/question', QuestionRouter);

app.get('/', (req, res) => {
    res.send('Server is running successfully!')
})

// check environment
if(config.util.getEnv('NODE_ENV') !== 'test'){
    app.use(morgan('dev'))
}

// check database
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// check port
server.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))

io.on('connection', socket => {
    console.log('connected!')
    socket.on('initialize', (msg) => {
        console.log('initialized')
        socket.emit('initialize', msg)  
    })
    socket.on('chat message', (roomId, msg) => {
        console.log('chat message sent')
        socket.emit('chat message', msg)

    })
    socket.on('newState', (roomId, msg) => {
        console.log('new state detected')
        socket.emit('newState', msg)
    })
})

module.exports = app;