const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: String,
  author: String,
  date: Date  
});

const placeSchema = new mongoose.Schema({
  name: String,
  highway: Number,  
  description: String,
  votes: Number,  
  images: [ String ],  
  services: {
    doesNotBelongToChain: Boolean,
    isOpenTwentyFourHours: Boolean,
    hasPlayground: Boolean,
    hasRestaurant: Boolean,
    hasCofee: Boolean,
    isAttraction: Boolean,
    isGasStation: Boolean,
    isGrill: Boolean
  },
  comments: [ commentSchema ]  
});

placeSchema.set('toObject', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

const Place = mongoose.model("Place", placeSchema);



module.exports = Place;