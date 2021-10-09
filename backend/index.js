const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('config')

const db = require('./db')
const AuthRouter = require('./routers/auth')
const QuestionRouter = require('./routers/questionRoutes');

const app = express()
const apiPort = process.env.PORT || 3030

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
if(config.util.getEnv('NODE_ENV') !== 'test'){
    app.use(morgan('dev'))
}
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Server is running!')
})
app.use('/api', AuthRouter)
app.use('/api/question', QuestionRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))

module.exports = app;