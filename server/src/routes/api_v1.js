const express = require("express");

//api paths for version 1
const planetsRouter = require('./planets/planets.router');
const launchRouter = require('./launches/launches.router');
  
//creating router that captures the first version of the api
const api = express.Router();
// api.use('/v1/planets',planetsRouter);

//removing v1 as we will be using before the router
api.use('/',planetsRouter);
api.use('/',launchRouter);

module.exports=api;