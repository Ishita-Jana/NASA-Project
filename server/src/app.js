const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const api = require('./routes/api_v1');

// const planetsRouter = require('./routes/planets/planets.router');
// const launchRouter = require('./routes/launches/launches.router');

const app = express();


app.use(cors({
    origin:'http://localhost:3000'
}));

//HTTP request logger middleware that simplifies the process of logging to your application
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname,"..",'public')));

//mounting the version 1 api routing
app.use('/v1',api);

// app.use('/v2',api_v2);  v2 routing for version 2



//versioning the routing
// app.use('/v1/planets',planetsRouter);
// app.use('/v1/launches',launchRouter);

app.get('/*', (req,res)=>{
    // console.log("hi");
    res.sendFile(path.join(__dirname,'..', 'public','index.html'));
});



module.exports = app;