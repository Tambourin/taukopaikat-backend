const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Place = require("../models/placeModel");
const api = supertest(app);
const testPlaces = require("./testPlaces");

const testPlace = testPlaces[0];

beforeEach(async () => {  
  await Place.deleteMany({});
  postedPlace = await api
    .post("/api/places")
    .send(testPlace);
 });

test("test vote", async () => {
  await api.get("/api/places")
      .expect(200);
});


afterAll(() => {
  mongoose.connection.close();
});