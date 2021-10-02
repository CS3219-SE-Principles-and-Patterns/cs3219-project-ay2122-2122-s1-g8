const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/peerprep', //"mongodb+srv://dbLong:cs3219@cluster0.o794u.mongodb.net/peer-help?retryWrites=true&w=majority", 
(error)=>{
    if(!error){
        console.log("DB has been started successfully");
    }else{
        console.log("DB fails to start");
    }
});

const db = mongoose.connection
module.exports = db