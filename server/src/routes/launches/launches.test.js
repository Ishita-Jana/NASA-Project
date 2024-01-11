//supertest make request against the api
const request = require('supertest');
const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo')
const {loadPlanetsData} = require('../../models/planets.model')


describe('Launches API', ()=>{

    beforeAll(async()=>{
        await mongoConnect();
        await loadPlanetsData();


    });

    afterAll(async()=>{
        await mongoDisconnect();
    })


    describe('Test GET /v1/launches ', ()=>{
        test('It should respond with 200 success ', async() => {
    
    
            // //passing the server (app) and calling the get request
            // const response = await request(app).get('/launches');
            // //jest asesertion statement
            // expect(response.statusCode).toBe(200);
    
            //combinning both
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200)
          },20000)
    })
    
    
    
    
    describe('Test POST /launches ',()=>{
    
    
    
    //cases
        const completelaunchData={
                mission: "USS Enterprise",
                rocket: "NCC 1701-D",
                target: "Kepler-62 f",
                launchDate: "January 4, 2028",
        }
    
        const launchDataWithoutDate = {
                mission: "USS Enterprise",
                rocket: "NCC 1701-D",
                target: "Kepler-62 f",
        }
    
        const launchDataWithInvalidDate ={
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            target: "Kepler-62 f",
            launchDate: "zoot",
        }
    
     
    
    
    
        test('It sould respond with 201 created',async()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(completelaunchData)
            .expect('Content-Type', /json/)
            .expect(201)
    
            const requestDate = new Date(completelaunchData.launchDate).valueOf() ;
            const res = response.body.launch;
            console.log(res);
            const responseDate = new Date(res.launchDate).valueOf() ;
            expect(responseDate).toBe(requestDate);
    
    
    
    
            //to check body we use jest assertions
            expect(response.body.launch).toMatchObject(launchDataWithoutDate)
    
    
        }, 30000);
    
    
        //error cases
        test('It should catch missing required launch property',async()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400)
    
            expect(response.body).toStrictEqual({
                error: "Missing required launch property"
            })
    
    
        } );
        test('It should catch invalid dates',async()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400)
    
            expect(response.body).toStrictEqual({
                error: "Invalid launch date"
            })
        } );
    })
})


