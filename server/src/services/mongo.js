const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;



//to check connection only once
mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready');
    })
    
//for error
mongoose.connection.on('error', (err)=>{
    console.log(err);
})

async function mongoConnect(){
    await mongoose.connect(MONGO_URL);
    console.log("connection established");
}

async function mongoDisconnect(){
    await mongoose.disconnect();
    console.log("mongo disconnected");
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}


    