require("dotenv").config();
const router = require("express").Router();
const Place = require("../models/placeModel");
const cache = require("../middleware/cache");
const googleService = require("../services/googleService");
const imageService = require("../services/imageService");

const SIMPLE_SELECT = "name highway votes images services comments";

router.get(
  "/",
  cache.getCache,
  async (request, response, next) => {
    try {      
      const places = await Place.find({}).select(SIMPLE_SELECT);      
      if (!places || places.length === 0) {
        return response.status(404).send({ error: "no content found" });
      }
      const placesObject = places.map(place => place.toObject());
      response.locals.data = await googleService.appendPlaces(placesObject);      
      return next();
    } catch (exception) {
      return response.status(500).send(exception.message);
    }
  },
  cache.setCache
);

router.get("/delete", async (request, response) => {
  console.log("delete");
  await Place.deleteMany({});
  response.status(204).end();
});

router.get(
  "/:id",
  cache.getCache, 
  async (request, response, next) => {
    try {
      const place = await Place.findById(request.params.id);     
      if (!place) {
        return response.status(404).end();
      }
      response.locals.data = place.toObject();
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
  const newImageId = await imageService.uploadImage(request.body.imageData);  
  const place = new Place({
    name: request.body.name,
    description: request.body.description,
    votes: 0,
    highway: request.body.highway,
    comments: [],
    images: newImageId ? [newImageId] : [],
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
    response.send(savedPlace.toObject());
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
      response.locals.data = place.toObject();
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
    response.send(place.comments[place.comments.length - 1].toObject());
  } catch (exception) {
    response.status(500).end();
  }
});



module.exports = router;
