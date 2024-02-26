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
    try {
        await mongoose.connect(MONGO_URL);
        console.log("connection established");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
   
}

async function mongoDisconnect(){
    await mongoose.disconnect();
    console.log("mongo disconnected");
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}


    