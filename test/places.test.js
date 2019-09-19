const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Place = require("../models/placeModel");
const api = supertest(app);

const testPlace = {
  name: "ABC Hirvaskangas",
  highway: 4,  
  description: "Tämä on kuvaus",
  images: [ ],  
  services: {
    doesNotBelongToChain: true,
    isOpenTwentyFourHours: true,
    hasPlayground: true,
    hasRestaurant: true,
    hasCofee: true,
    isAttraction: true,
    isGasStation: true,
    isGrill: true
  }
};

let postedPlace = null;

beforeEach(async () => {  
  await Place.deleteMany({});
  postedPlace = await api
    .post("/api/places")
    .send(testPlace);
 });

describe("basic get and post", () => { 
  test("can get response 200", async () => {
    await api.get("/api/places")
      .expect(200);
  });
  
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

  test("posting with false id return error", async () => {
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
});



afterAll(() => {
  mongoose.connection.close()
})