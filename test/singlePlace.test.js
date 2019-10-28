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

const anotherTestPlace = {    
  name: "Vaskikello",
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
}


let postedPlace = null;

beforeEach(async () => {  
  await Place.deleteMany({});
  response = await api
    .post("/api/places")
    .send(testPlace);
  postedPlace = response.body;
 });

test("can get response for singlePlace GET", async () => {
  await api.get("/api/places/cache/clear");
  const response = await api.get("/api/places/" + postedPlace._id);
  expect(response.body).toMatchObject(testPlace);
});



test("put place", async () => {
  expect(postedPlace.highway).toBe(4);
  const response = await api
    .put("/api/places/"+ postedPlace._id)
    .send({...postedPlace, highway: 999 });
  expect(response.body.highway).toBe(999);
  const responseGetPlace = await api.get("/api/places/" + postedPlace._id); 
  expect(responseGetPlace.body.highway).toBe(999); 
});

test("put place cache", async () => {
  const response = await api.get("/api/places/" + postedPlace._id);
  expect(response.body.highway).toBe(4);
  await api
    .put("/api/places/"+ postedPlace._id)
    .send({...postedPlace, highway: 999, images: ["xxx"] });  
  const response2 = await api.get("/api/places/" + postedPlace._id);
  expect(response2.body.highway).toBe(999);  
});

test("put cache, cached content is an array", async () => {
  await api
    .post("/api/places")
    .send(anotherTestPlace);
  const response = await api.get("/api/places/" + postedPlace._id);
  expect(response.body.highway).toBe(4);
  await api
    .put("/api/places/"+ postedPlace._id)
    .send({...postedPlace, highway: 999, images: ["xxx"] });
  const response2 = await api.get("/api/places/" + postedPlace._id);
  expect(response2.body.highway).toBe(999);
  const allPlaces = await api.get("/api/places");
  expect(allPlaces.body[0].highway).toBe(999);
});

afterAll(() => {
  mongoose.connection.close()
});