

const {
    getAllLaunches,
    // addNewlaunch,
    existsLaunchWithId,
    abortLaunchById,
    scheduleNewLaunch
    }= require('../../models/launches.model');


const {getPagination} = require('../../services/query');    


//naming a function with an http to help user that it will return a response

async function httpGetAllLaunches(req,res){
    const {skip,limit} = getPagination(req.query);
    // console.log(req.query); 
    // console.log("limit", limit);
    // console.log("page",req.query.page, skip);
    const launches = await getAllLaunches(skip,limit);
    return res.status(200).json(launches);
}

async function httpAddNewLaunches(req,res){
    
    const launch = req.body;
    // console.log(launch);
    

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({
            error: "Missing required launch property",
        })
    }

    launch.launchDate = new Date(launch.launchDate);
    // console.log(launch.launchDate);
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error: 'Invalid launch date',
           
        })
    }

 

    
    
    // console.log(launch)
    await scheduleNewLaunch(launch);
    // console.log(launch);
    return res.status(201).json({
        ok: true,
        launch: launch
    });

   
}


async function httpAbortLaunch(req,res){

    const launchId = Number(req.params.id);
    const existlaunch = await existsLaunchWithId(launchId);
    if(!existlaunch){

        return res.status(400).json({
            error: 'Launch not found',
          }) 
    }
    
    const aborted = abortLaunchById(launchId);
    if(!aborted){
        return res.status(400).json({
            error: 'Launch not aborted'
        })
    }

    else{
        return res.status(200).json({
            ok: true
        })
    }
    


}

module.exports={
    httpGetAllLaunches,
    httpAddNewLaunches,
    httpAbortLaunch
}