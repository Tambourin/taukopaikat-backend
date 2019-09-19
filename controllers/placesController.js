require("dotenv").config();
const router = require("express").Router();
const Place = require("../models/placeModel");
const cache = require("../middleware/cache");
const googleService = require("../services/googleService");

const SIMPLE_SELECT = "name highway votes images services";

router.get(
  "/",
  cache.getCache,
  async (request, response, next) => {
    try {
      const places = await Place.find({}).select(SIMPLE_SELECT);
      if (!places || places.length === 0) {
        return response.status(404).send({ error: "no content found" });
      }
      response.locals.data = await googleService.appendPlaces(
        places.map(place => place._doc)
      );      
      return next();
    } catch (exception) {
      return response.status(500).end();
    }
  },
  cache.setCache
);

router.get(
  "/:id",
  cache.getCache, 
  async (request, response, next) => {
    try {
      const place = await Place.findById(request.params.id);     
      if (!place) {
        return response.status(404).end();
      }  
      response.locals.data = { ...place._doc };
      return next();
    } catch (exception) {
      console.log(exception);
      return response.status(400).send({ error: "cast error" });
    }
  },
  cache.setCache
);

router.get("/cache/clear", (request, response) => {
  if (process.env.NODE_ENV !== "test") {
    return response.status(401).end();
  }
  cache.flush();
  response.status(202).end();
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
    cache.flush();
    response.send(savedPlace);
  } catch (exception) {
    console.log(exception);
    response.status(500).send({ error: "error saving place " });
  }
});

router.put(
  "/:placeId", 
  async (request, response, next) => {  
    try {
      const place = await Place.findByIdAndUpdate(
        request.params.placeId,
        request.body, 
        { new: true } 
      );      
      response.locals.data = { ...place._doc };
      next();
    } catch (exception) {
      console.log(exception);
      response.status(500).send({ error: "error updating place " });
    } 
  }
  ,cache.updateCache
);

router.get("/:placeId/comments", async (request, response) => {
  try {
    const comments = await Place.findById(request.params.placeId).select(
      "comments"
    );
    if (!comments) {
      return response.status(404).end();
    }
    response.send(comments);
  } catch (exception) {
    return response.status(400).send({ error: "cast error" });
  }
  
});

router.post("/:placeId/comments", async (request, response) => {
  let place;
  try {
    place = await Place.findById(request.params.placeId);
    if (!place) {
      response.status(404).end();
    }
    place.comments.push(request.body);
  } catch (exception) {
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
