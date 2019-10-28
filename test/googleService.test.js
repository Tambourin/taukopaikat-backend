const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Place = require("../models/placeModel");
const api = supertest(app);
const googleService = require("../services/googleService");
const testPlaces = require("./testPlaces");


beforeEach(async () => {  
  await Place.deleteMany({});
  response = await api
    .post("/api/places")
    .send(testPlaces[0]);
  postedPlace = response.body;
 });

test("objects in a list are appended with new properties", async () => {
  const newList = await googleService.appendPlaces(testPlaces);
  newList.forEach(element => {   
    expect(element).toHaveProperty("coordinates");
  });   
});

test("get google data about place", async () => { 
  //expect(postedPlace).toHaveProperty("googlePlaceId");
  const response = await api.get(`/api/places/${postedPlace.id}/google`);
  expect(response.body).toHaveProperty("address");
  expect(response.body).toHaveProperty("googleRating");
  expect(response.body).toHaveProperty("openingHours");
  expect(response.body).toHaveProperty("www");
});

afterAll(() => {
  mongoose.connection.close()
});