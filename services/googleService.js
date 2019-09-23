require("dotenv").config();
const axios = require("axios");

const KEY = process.env.GOOGLE_API_KEY;
const QUERY_FIELDS_SIMPLE_SEARCH =
  "geometry,photos";
const QUERY_FIELDS_EXTENDED_SEARCH = 
  "formatted_address,rating,opening_hours,geometry,permanently_closed,photos";

const searchGooglePlace = (place, queryFields) => {
  const searchWord = place.name;
  return axios.get(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${searchWord}&inputtype=textquery&fields=${queryFields}&key=${KEY}`
  );
};

const append = async place => { 
  try {
    const searchResponse = await searchGooglePlace(
      place,
      QUERY_FIELDS_SIMPLE_SEARCH
    );
    const propertiesFromGoogle = searchResponse.data.candidates[0];
    const appendedPlace = {
      ...place,
      coordinates: propertiesFromGoogle.geometry.location,      
      googleImages: [propertiesFromGoogle.photos[0].photo_reference]
    };
    return appendedPlace;
  } catch {
    console.log("Error connecting Google API");
    return place;
  }
};

const appendPlaces = async places => {
  return await Promise.all(places.map(place => append(place)));
};

module.exports = { appendPlaces };
