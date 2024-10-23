// import { post } from "../../../server/src/routes/launches/launches.router";



// const API_URL = process.env.REACT_APP_Local_API_URL;
const API_URL = process.env.REACT_APP_API_URL;


async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  // console.log("requesting for getting all the planets");
  // console.log(await response.json());
  // console.log(await response.json());
  return await response.json();

}

 // Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a,b)=>{
    return a.flightNumber - b.flightNumber;
  })
 
}

  // Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {

  try{
    return await fetch(`${API_URL}/launches`,{
      method: "post",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(launch),
     })
  }
  catch(err){
    return {
      ok:false
    }
  }
 
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {

  try {

    return await fetch(`${API_URL}/launches/${id}`,{
      method: "delete",
    });
    
  } catch (error) {
    console.log(error);
    return {
      ok: false
    }
  }
  
 
  
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};