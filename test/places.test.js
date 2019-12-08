const supertest = require("supertest");
const app = require("../app");
const axios = require("axios");
const mongoose = require("mongoose");
const Place = require("../models/placeModel");
const api = supertest(app);

const testPlace = {
  name: "ABC Hirvaskangas",
  highway: 4,  
  description: "Tämä on kuvaus",
  city: "Äänekoski",
  images: [ ],  
  services: {
    doesNotBelongToChain: false,
    isOpenTwentyFourHours: true,
    hasPlayground: true,
    hasRestaurant: true,
    hasCofee: true,
    isAttraction: false,
    isGasStation: true,
    isGrill: false
  }
};

let token = null;


let postedPlace = null;

beforeEach(async () => {
  const response = await axios
    .post("https://taukopaikat.eu.auth0.com/oauth/token"
    ,{
      "grant_type": "password",
      "username": process.env.AUTH_USERNAME,
      "password": process.env.AUTH_PASSWORD,
      "audience": process.env.AUTH_AUDIENCE,
      "scope": "openid profile email",
      "client_id": process.env.AUTH_CLIENT_ID,
      "client_secret": process.env.AUTH_CLIENT_SECRET
    });
  token = response.data.access_token;   
  await Place.deleteMany({});
  //const postPlaceResponse = await axios.post("http://localhost:3001/api/places", testPlace, {headers: {'Authorization': "bearer " + token}});  
  const postPlaceResponse = await supertest(app).post("/api/places").send(testPlace).set('Authorization', 'Bearer ' + token).end().expect(200);
  postedPlace = postPlaceResponse.data;
  console.log(postedPlace);
 });

describe("basic get and post", () => { 
  test("can get response 200", async () => {
    await api.get("/api/places")
      .expect(200);
  });
  /*
  test("posted place gets right googlePlaceID", async () => {
    expect(postedPlace.body.googlePlaceId).toBe("ChIJP51vnAylhUYRQ1KYuEzpfmk");
  })

  test("return 404 if no content in db", async () => {
    await Place.deleteMany({});    
    await api.get("/api/places/cache/clear");
    await api.get("/api/places").expect(404);
  });

  test("response contains places with right content", async() => {
    await api.get("/api/places/cache/clear");
    const response = await api.get("/api/places");    
    expect(response.body);
    const {description, ...expectedResult} = testPlace;
    expect(response.body).toMatchObject([expectedResult]);
  });
  
  test("can get response from post request", async () => {  
    const response = await api
      .post("/api/places")
      .send(testPlace)
      .expect('Content-Type', /json/)
      .expect(200);  
  });

  test("data is saved in cache", async() => {
    await api.get("/api/places").expect(200);
    await Place.deleteMany({});
    await api.get("/api/places").expect(200);
  });

  
});

describe("single place", () => {
  test("get single place", async () => { 
    const id = postedPlace.body._id  
    const response = await api.get("/api/places/" + id);
    expect(response.body).toMatchObject(testPlace);
  });

  test("get comments", async () => {
    const response = await api.get("/api/places/" + postedPlace.body._id + "/comments");    
  });

  test("posting a comment returns 200 and comment has an _id", async () => {
    const response = await api
      .post("/api/places/" + postedPlace.body._id + "/comments")
      .send({ content: "ddddd" })
      .expect(200);
    expect(response.body).toMatchObject({ content: "ddddd" });
    expect(response.body).toHaveProperty("_id");
  });

  test("posting with comment false id return error", async () => {
    await api.post("/api/places/falseId/comments")
      .send({ content: "ddddd" })
      .expect(400);
  });

  test("the posted comment can be found nested in a place", async () => {
    await api
      .post("/api/places/" + postedPlace.body._id + "/comments")
      .send({ content: "ddddd" });
    const response = await api.get("/api/places/" + postedPlace.body._id);
    expect(response.body.comments[0]).toMatchObject({ content: "ddddd" });
  });
  */
});



afterAll(() => {
  mongoose.connection.close()
})