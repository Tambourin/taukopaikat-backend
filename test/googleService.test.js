require("dotenv").config();
const supertest = require("supertest");
const app = require("../app");
const axios = require("axios");
const mongoose = require("mongoose");
const Place = require("../models/placeModel");
const api = supertest(app);
const googleService = require("../services/googleService");
const testPlaces = require("./testPlaces");

let token = null;

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
  console.log(token);
  await Place.deleteMany({});
  response = await api
    .post("/api/places")
    .set("Authorization", `Bearer ${token}`)
    .send(testPlaces[0]);
  postedPlace = response.body;
 });

test("objects in a list are appended with new properties", async () => {
  const newList = await googleService.appendPlaces(testPlaces);
  newList.forEach(element => {   
    expect(element).toHaveProperty("coordinates");
  });   
});
/*
test("get google data about place", async () => { 
  //expect(postedPlace).toHaveProperty("googlePlaceId");
  const response = await api.get(`/api/places/${postedPlace.id}/google`);
  expect(response.body).toHaveProperty("address");
  expect(response.body).toHaveProperty("googleRating");
  expect(response.body).toHaveProperty("openingHours");
  expect(response.body).toHaveProperty("www");
});
*/
afterAll(() => {
  mongoose.connection.close()
});