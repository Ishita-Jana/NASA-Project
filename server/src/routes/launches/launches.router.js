const express = require('express');

const  launchRouter = express.Router();

const {httpGetAllLaunches} = require('./launches.controller');
const {httpAddNewLaunches} = require('./launches.controller');
const { httpAbortLaunch } = require('./launches.controller');

launchRouter.get('/launches', httpGetAllLaunches);
launchRouter.post('/launches', httpAddNewLaunches);
launchRouter.delete('/launches/:id', httpAbortLaunch);


module.exports = launchRouter;