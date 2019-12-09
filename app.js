require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const jwtCheck = require("./middleware/tokenValidation");
const bodyParser = require("body-parser");
const placeController = require("./controllers/placesController");
const votesController = require("./controllers/votesController");
const commentsController = require("./controllers/commentsController");

let databaseUri = process.env.MONGODB_TEST_URI;
if(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
databaseUri = process.env.MONGODB_URI;
}
  
mongoose.set('useFindAndModify', false);
mongoose.connect(databaseUri, { useNewUrlParser: true })
  .then(() => console.log("connected to mongoDB"))
  .catch(() => console.log("error connecting mongoDB"));

console.log(process.env.NODE_ENV);

if(process.env.NODE_ENV !== "production") {
  app.use(cors());
}
if(process.env.NODE_ENV === "production") {
  app.use(cors({
    origin: 'https://www.taukopaikat.fi'
  }));
}

app.use(bodyParser.json({ limit: "20MB" } ));
app.use(express.static(path.join(__dirname, 'build'), {
  etag: false
}));
app.get("*", (req, res, next) => {
  console.log(req.headers);
  next();
})
app.get('/redirect', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/places/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.post("*", jwtCheck, (request, response, next) => {
  next();
});
app.put("*", jwtCheck, (request, response, next) => {
  next();
});
app.delete("*", jwtCheck, (request, response, next) => {
  next();
});
app.options("/api/places/:placeId/votes", cors());
app.use("/api/places", placeController);
app.use("/api/places", votesController);
app.use("/api/places", commentsController);

module.exports = app;