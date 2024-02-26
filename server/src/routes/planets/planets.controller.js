// const {planets} = require('../../models/planets.model');
const {getAllPlanets} = require('../../models/planets.model');
const {planets} = require('../../models/planets.model');

async function httpGetAllPlanets(req,res){
// console.log("hello");
    // console.log("allPlanetsfunction ",planets);
    // const result = await getAllPlanets();
    // console.log("result ",result);
   return res.status(200).json(await getAllPlanets());
}

module.exports = {
    httpGetAllPlanets
}