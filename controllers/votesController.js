const router = require("express").Router();
const Place = require("../models/placeModel");
const googleService = require("../services/googleService");
const cache = require("../middleware/cache");

router.post("/:placeId/votes", async (request, response) => {
  cache.flush(); 
  try {
    const place = await Place.findById(request.params.placeId);
    place.votes.push(request.user.sub);
    place.save(); 
    response.send(await googleService.appendSinglePlace(place.toObject()));
  } catch (exception) {
    console.log(exception.message);
    response.status(500).send({ error: exception.message });
  }  
});

router.delete("/:placeId/votes", async (request, response) => {  
  cache.flush(); 
  try {
    const place = await Place.findById(request.params.placeId);
    place.votes = place.votes.filter(
      vote => vote !== request.user.sub
    );   
    place.save();
    response.send(await googleService.appendSinglePlace(place.toObject()));
  } catch (exception) {
    console.log(exception.message);
    response.status(500).send({ error: exception.message });
  }  
});

module.exports = router;