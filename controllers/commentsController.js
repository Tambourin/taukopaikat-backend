const router = require("express").Router();
const Place = require("../models/placeModel");
const cache = require("../middleware/cache");

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
  cache.flush();  
  try {
    const place = await Place.findById(request.params.placeId);    
    if (!place) {
      response.status(404).end();
    }
    const newComment = { ...request.body, date: new Date() };
    place.comments.push(newComment);   
    await place.save();
    response.send(place.comments[place.comments.length - 1].toObject()); 
  } catch (exception) {
    response.status(400).send({ error: exception.message });
  }  
});

module.exports = router;