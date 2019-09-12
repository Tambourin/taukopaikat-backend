require("dotenv").config();
const axios = require("axios");

const KEY = process.env.GOOGLE_API_KEY;
const QUERY_FIELDS_SIMPLE_SEARCH = "formatted_address,rating,opening_hours,geometry,permanently_closed";

const searchGooglePlace = (place, queryFields) => {
  const searchWord = place.name; 
  return axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${searchWord}&inputtype=textquery&fields=${queryFields}&key=${KEY}`);
}

const appendPlace = async (place) => {
    if(place._doc) {
      place = place._doc;
    }    
    try { 
      const searchResponse =  await searchGooglePlace(place, QUERY_FIELDS_SIMPLE_SEARCH);
      const propertiesFromGoogle = searchResponse.data.candidates[0];    
      const appendedPlace = {
        ...place,
        address: propertiesFromGoogle.formatted_address,
        coordinates: propertiesFromGoogle.geometry.location,
        openNow: propertiesFromGoogle.opening_hours.open_now,
        googleRating: propertiesFromGoogle.rating          
      }
      return appendedPlace;
    } catch {
      console.log("Error connecting Google API");
      return place;
    }   
}

const appendPlaces = async (places) => {    
  return await Promise.all(places.map(place => appendPlace(place))); 
}

module.exports = { appendPlaces };