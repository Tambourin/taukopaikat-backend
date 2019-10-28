require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const placeController = require("./controllers/placesController");
const votesController = require("./controllers/votesController");
const commentsController = require("./controllers/commentsController");

let uri = process.env.MONGODB_TEST_URI;
if(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
  uri = process.env.MONGODB_URI;
}
  
mongoose.set('useFindAndModify', false);
mongoose.connect(uri, { useNewUrlParser: true })
  .then(() => console.log("connected to mongoDB"))
  .catch(() => console.log("error connecting mongoDB"));

app.use(cors());
app.use(bodyParser.json({ limit: "5MB" } ));
app.use("/api/places", placeController);
app.use("/api/places", votesController);
app.use("/api/places", commentsController);

module.exports = app;