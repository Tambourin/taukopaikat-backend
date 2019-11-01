require("dotenv").config();
const router = require("express").Router();
const jwtCheck = require("../middleware/tokenValidation");
const Place = require("../models/placeModel");
const cache = require("../middleware/cache");
const googleService = require("../services/googleService");
const imageService = require("../services/imageService");

if (process.env.NODE_ENV !== "test") {
  router.post("*", jwtCheck, (request, response, next) => {
    next();
  });
}

router.get(
  "/",
  cache.getCache,
  async (request, response, next) => {
    console.log(process.env.NODE_ENV);
    try {      
      const places = await Place.find({});      
      if (!places || places.length === 0) {
        return response.status(404).send({ error: "no content found" });
      }
      const placesObjects = places.map(place => place.toObject());
      response.locals.data = await googleService.appendPlaces(placesObjects);      
      return next();
    } catch (exception) {
      return response.status(500).send(exception.message);
    }
  },
  cache.setCache
);

router.get("/delete", async (request, response) => {
  console.log("delete");
  cache.flush();
  await Place.deleteMany({});
  response.status(204).end();
});

router.get(
  "/:PlaceId",
  cache.getCache,
  async (request, response, next) => {
    try {
      const place = await Place.findById(request.params.PlaceId);     
      if (!place) {
        return response.status(404).end();
      }      
      response.locals.data = await googleService.appendSinglePlace(place.toObject());
      return next();
    } catch (exception) {
      console.log(exception);
      return response.status(400).end();
    }
  },
  cache.setCache
);

router.get("/:placeId/google", async (request, response) => {
  try {
    const place = await Place.findById(request.params.placeId);
    const googleData = await googleService.getGoogleData(place.googlePlaceId);
    response.send(googleData);
  } catch(error) {
    console.log(error);
    return response.status(400).send({ error: error });
  }
});

router.get("/cache/clear", (request, response) => {
  if (process.env.NODE_ENV !== "test") {
    return response.status(401).end();
  }
  cache.flush();
  response.status(202).end();
});

router.post("/", async (request, response) => {  
  try {  
    let newImageId;
    if (request.body.imageData) {
      newImageId = await imageService.uploadImage(request.body.imageData);
    } else {
      newImageId = null;
    }  
    const googlePlaceId = await googleService.searchGooglePlaceId(request.body.name);   
    
    const place = new Place({
      name: request.body.name,
      description: request.body.description,
      votes: request.body.votes ? request.body.votes : 0,
      highway: request.body.highway,
      city: request.body.city,
      comments: [],
      images: newImageId ? [newImageId] : [],
      services: {
        doesNotBelongToChain: request.body.services.doesNotBelongToChain,
        isOpenTwentyFourHours: request.body.services.isOpenTwentyFourHours,
        hasBeenAvarded: request.body.services.hasBeenAvarded,
        isAttraction: request.body.services.isAttraction,
        isSummerCafe: request.body.services.isSummerCafe,
        isGasStation: request.body.services.isGasStation,
        isGrill: request.body.services.isGrill
      },
      googlePlaceId: googlePlaceId
    });
  
    const savedPlace = await place.save();    
    const responsePlace = await googleService.appendSinglePlace(savedPlace.toObject());
    cache.flush();
    response.send(responsePlace);
  } catch (exception) {
    console.log(exception.message);
    response.status(500).send({ error: "error saving place " + exception.message });
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
      cache.flush();
      response.send({ ...request.body, ...place.toObject() });
      
    } catch (exception) {
      console.log(exception);
      response.status(500).send({ error: "error updating place " });
    } 
  }  
);



router.post("/:placeId/images", async (request, response, next) => {  
  try {
    const newImageId = await imageService.uploadImage(request.body.imageData);
    if (newImageId === null) {
      return response.status(500).send({ error: "could not save image-file"} );
    }    
    const place = await Place.findById(request.params.placeId);  
    const placeObject = place.toObject();  
    const newPlace = { ...placeObject, images: [ ...placeObject.images, newImageId ] };   
    const updatedPlace = await Place.findByIdAndUpdate(place.id, newPlace, { new: true });  
    cache.flush();  
    response.send(updatedPlace.toObject());
  } catch (exception) {
    response.status(500).send({ error: exception.message });
  }  
});


module.exports = router;
