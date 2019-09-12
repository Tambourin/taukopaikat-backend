require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const placeController = require("./controllers/placesController");

const url = process.env.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true })
  .then(() => console.log("connected to mongoDB"))
  .catch(() => console.log("error connecting mongoDB"));

app.use(bodyParser.json());
app.use("/api/places", placeController);

module.exports = app;