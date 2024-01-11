const axios = require('axios');
const launches = require('./launches.mongo.js');
const planets = require('./planets.mongo.js');


// const launches= new Map();

// let latestFlightNumber = 100;

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";


// const launch = {
//     flightNumber: 100, //flight number
//     mission : 'Kepler Exploration X', //name
//     rocket: 'Explorer IS1', //rocket.name
//     launchDate: new Date('December 27, 2030'),  //date_local
//     target : 'Kepler-442 b', //not applicable
//     customer: ['NASA', 'ZTM'],  // payloads.customers for each payload
//     upcoming: true, //upcoming
//     success: true, //success
// };


async function getLatestFlightNumber(){
    const latestlaunch = await launches.findOne().sort('-flightNumber')

    if(!latestlaunch){
        return DEFAULT_FLIGHT_NUMBER
    }
    return latestlaunch.flightNumber;
}

// saveLaunch(launch);


async function populateLaunches(){
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options : {
            pagination: false,
            populate : [
                {
                    path: 'rocket',
                    select : {
                        name : 1
                    }
                },
                {
                    path : 'payloads',
                    select: {
                        'customers' : 1
                    }
                }
            ]
        }
    });

    if(response.status !== 200){
        console.log('Problem downloading launch data')
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs){

        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload)=>{
            return payload['customers'];
        })
        console.log(customers);

        const launch = {
            flightNumber : launchDoc['flight_number'],
            mission : launchDoc['name'],
            rocket : launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success : launchDoc['success'],
            customer: customers,
        }
       console.log(`${launch.flightNumber} ${launch.mission}`); 

       //database 
       await saveLaunch(launch);
    }
}

async function loadLaunchesData(){


   //finding if this flight number and launch data exists so not make the same request again
   const firstlaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
   })

   if(firstlaunch){
    console.log("Launch data already exists in the database");
    return;
   }

   else{
    console.log("Download launch Data......");
    await populateLaunches();

   }
   

}





// launches.set(launch.flightNumber, launch);

async function saveLaunch(launch){

    try {
        
        //not needed


        // const planet = await planets.findOne({
        //     keplerName: launch.target
        // })

        // if(!planet){
        //     throw new Error('No matching planet was found');
        // }
        // //  console.log(data.kepler_name);

    await launches.updateOne({
        flightNumber: launch.flightNumber,
    },launch,{
        upsert: true
    });
    
} catch (error) {
    console.log(`Could not save planet ${error}`)
}
}


async function findLaunch(filter){
    return await launches.findOne(filter);
}


async function existsLaunchWithId(launchId){
    return await launches.findOne({
        flightNumber: launchId
    });
}

async function getAllLaunches(skip,limit){
    // return Array.from(launches.values());
    console.log("value of skip and limit",skip,limit);
    return await launches
    .find({},{'_id':0, '__v':0})
    .sort({flightNumber : 1})
    .skip(skip) //skipping first 20 launches as no inbuilt page is there
    .limit(limit);//limiting to 10 launches
}

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({
            keplerName: launch.target
        })

        if(!planet){
            throw new Error('No matching planet was found');
        }
        //  console.log(data.kepler_name);
    const newFlightNumber = await getLatestFlightNumber()+1;
    const newLaunch =  Object.assign(launch,{
        flightNumber: newFlightNumber,
        upcoming : true,
        customers: ['ZTM', 'NASA'],
        success: true
    })


    await saveLaunch(newLaunch);

}


// function addNewlaunch(launch){
//      latestFlightNumber ++;
//     launches.set(latestFlightNumber, Object.assign(launch,{
//         flightNumber: latestFlightNumber,
//         upcoming : true,
//         customers: ['ZTM', 'NASA'],
//         success: true
//     }))

//     console.log(launches);
// }

async function abortLaunchById(launchId){
    // launch.delete(launchId);
    const aborted = await launches.updateOne({
        flightNumber: launchId
    },{
        upcoming:false,
        success:false
    })

    // return aborted.ok === 1 && aborted.nModified === 1;
    return aborted.modifiedCount === 1;

    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;

}

module.exports = {
    loadLaunchesData,
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}