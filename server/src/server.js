const http = require('http');
const mongoose = require('mongoose')
require('dotenv').config();
const app = require('./app');

const {loadPlanetsData} = require('./models/planets.model');
const {loadLaunchesData} = require('./models/launches.model');
const { mongoConnect } = require('./services/mongo');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);



async function startServer(){
 
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, ()=>{
        console.log(`app listening on port ${PORT}`);
    });

}

// async function startServer(){
//     await loadPlanetsData();

//     server.listen(PORT, ()=>{
//         console.log(`app listening on port ${PORT}`);
//     });
// }

startServer();




