const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next){
    //const authHeader = req.headers['authorization']
    //const token = authHeader && authHeader.split(' ')[1]
    const authHeader = req.body['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) console.log(err)
        if(err) return res.sendStatus(401)
        req.user = user;
        next();
    })
}

module.exports = authenticateToken