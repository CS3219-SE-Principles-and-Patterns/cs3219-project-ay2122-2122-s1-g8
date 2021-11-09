const mongoose = require('mongoose');
const redis = require('redis')
const config = require('config')

mongoose.connect(config.DBHost, 
(error)=>{
    if(!error){
        console.info("DB has been started successfully");
    }else{
        console.info("DB fails to start");
    }
});

// instantiate redis client
var redisClient = null;
if(process.env.NODE_ENV === 'test'){
    redisClient = redis.createClient().on('connect', () => console.info("Redis database connected locally"))
}
else{
    redisClient = redis.createClient({
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD
    }).on('connect', () => console.info("Redis database connected"))
}


const db = mongoose.connection
module.exports = {
    db, redisClient
}