const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const commentSchema = new mongoose.Schema({
  content: String,
  author: String,
  date: Date
});

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  highway: {
    type: Number,
    required: true
  },
  description: String,
  city: {
    type: String,
    required: true
  },
  votes: [String],
  images: [String],
  services: {
    doesNotBelongToChain: Boolean,
    isOpenTwentyFourHours: Boolean,
    hasBeenAvarded: Boolean,
    isAttraction: Boolean,
    isSummerCafe: Boolean,
    isGasStation: Boolean,
    isGrill: Boolean,
    isBakery: Boolean,
    hasMarketplace: Boolean
  },
  comments: [commentSchema],
  googlePlaceId: String
});

placeSchema.plugin(uniqueValidator);
placeSchema.set("toObject", { virtuals: true });
commentSchema.set("toObject", { virtuals: true });

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
