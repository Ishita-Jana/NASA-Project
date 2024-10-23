const path = require('path');
const fs = require('fs');
const {parse} = require('csv-parse');
const planets = require('./planets.mongo');

// const habitablePlanets = [];

function isHabitablePlanet(planet){
    // console.log(planet['koi_disposition'])
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData(){

   return new Promise((resolve,reject)=>{

    fs.createReadStream(path.join(__dirname,'..','..','data','keplar_data.csv'))
    .pipe(parse({
        comment: '#',
        columns: true,
    }))
    .on('data',async(data)=>{

        // console.log(data)
        if(isHabitablePlanet(data)){
            // habitablePlanets.push(data);

            //will create duplicate data so we will use upsert (insert + update)
            /* await planets.create({
                 keplerName: data.kepler_name,
             });
            */

            //  console.log("kepler name data ",data.kepler_name);
             savePlanet(data);
            



        }
       
        })
    .on('error',(error)=>{
        console.log(error);
        reject(error);
    })
    .on('end',async()=>{
            // console.log(`${habitablePlanets.length} planets are habitable`);
            const countPlanetsFound = (await getAllPlanets()).length
            // console.log(await getAllPlanets());
            console.log(`${countPlanetsFound} planets are habitable`);
            resolve();
            // console.log(habitablePlanets.map((planet)=>{
            //     return planet['kepler_name'];
            // }))
            // console.log("parsing done!");
           
        });

   }) 
}


async function getAllPlanets(){
    // console.log("inside getAllPlanets function");
    // console.log("planets",await planets.find({}));
    return await planets.find({},);
}


//making it reusable
async function savePlanet(data){

    try {
            //  console.log("inside save planets",data.kepler_name);

        await planets.updateOne({
            keplerName: data.kepler_name,
        },{
            keplerName: data.kepler_name,
        },{
            upsert: true
        });
        
    } catch (error) {
        console.log(`Could not save planet ${error}`)
    }
   
} 




        module.exports = {
            loadPlanetsData,
            getAllPlanets,
            savePlanet,
            planets: getAllPlanets(),
        }