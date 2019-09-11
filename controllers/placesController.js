const router = require("express").Router();
const Place = require("../models/placeModel");
const cache = require("../middleware/cache");
const googleService = require("../services/googleService");

router.get("/", cache.getCache, async (request, response, next) => { 
  try {
    const places = await Place
      .find({})
      .select("name highway votes images services");    
    if (!places || places.length === 0) {
      return response.status(404).send({ error: "no content found" });
    }      
    response.locals.data = googleService.appendPlaceInfo(places);
    next();
  } catch(exception) {
    return response.status(500).end();
  }    
}, cache.setCache);

router.get("/cache/clear/", (request, response) => {
  cache.flush();
  response.status(202).end();
});

router.get("/:id", async(request, response) => {
  try{
    const place = await Place.findById(request.params.id);
    if (!place) {
      console.log("place not found");
      response.status(404).end();
    }
    response.send(place);
  } catch (exception) {
    console.log(exception);
    response.status(400).send({ error: "cast error" });
  }  
});

router.post("/", async (request, response) => {  
  const place = new Place({
    name: request.body.name,
    description: request.body.description,
    votes: 0,
    highway: request.body.highway,
    comments: [],
    images: request.body.images ? request.body.images : [],
    services: {
      doesNotBelongToChain: request.body.services.doesNotBelongToChain,
      isOpenTwentyFourHours: request.body.services.isOpenTwentyFourHours,
      hasPlayground: request.body.services.hasPlayground,
      hasRestaurant: request.body.services.hasRestaurant,
      hasCofee: request.body.services.hasCofee,
      isAttraction: request.body.services.isAttraction,
      isGasStation: request.body.services.isGasStation,
      isGrill: request.body.services.isGasStation
    }
  });

  try {  
    const savedPlace = await place.save();      
    response.send(savedPlace);
  } catch(exception) {
    console.log(exception);
    response.status(500).send({ error: "error saving place "});
  }
});

router.get("/:placeId/comments", async (request, response) => {
  const comments = await Place
    .findById(request.params.placeId)
    .select("comments");
  response.send(comments); 
});

router.post("/:placeId/comments", async (request, response) => {
  let place;
  try {
    place = await Place.findById(request.params.placeId);
    if (!place) {
      response.status(404).end();
    }
    place.comments.push(request.body);
  } catch(exception) {
    response.status(400).send({ error: exception.message });
  }    
  try {
    await place.save();   
    response.send(place.comments[0]);
  } catch (exception) {
    response.status(500).end();
  }    
});

module.exports = router;