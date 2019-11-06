const router = require("express").Router();
const Place = require("../models/placeModel");
const googleService = require("../services/googleService");

router.post("/:placeId/votes", async (request, response) => {
  try {
    const place = await Place.findById(request.params.placeId);
    place.votes += 1;
    place.save(); 
    response.send(await googleService.appendSinglePlace(place.toObject()));
  } catch (exception) {
    console.log(exception.message);
    response.status(500).send({ error: exception.message });
  }  
});

router.delete("/:placeId/votes", async (request, response) => {  
  try {
    const place = await Place.findById(request.params.placeId);
    place.votes -= 1;
    place.save();
    response.send(await googleService.appendSinglePlace(place.toObject()));
  } catch (exception) {
    console.log(exception.message);
    response.status(500).send({ error: exception.message });
  }  
});

module.exports = router;