require("dotenv").config();
const axios = require("axios");

const KEY = process.env.GOOGLE_API_KEY;
const QUERY_FIELDS_SIMPLE_SEARCH =
  "geometry,photos,rating";
const QUERY_FIELDS_EXTENDED_SEARCH = 
  "formatted_address,rating,opening_hours,geometry,permanently_closed,photos,website";

const searchGooglePlaceId = async (searchWord) => {
  const encodedSearchWord = encodeURI(searchWord);  
  console.log(encodedSearchWord);
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodedSearchWord}&inputtype=textquery&fields=place_id&key=${KEY}`
  );
  console.log(response.data.candidates[0]);
  if (response.data.candidates[0]) {    
    return response.data.candidates[0].place_id;
  } else {
    return null;
  }  
};

const getGooglePlaceDetails = (placeId, queryFields) => {  
  return axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&inputtype=textquery&fields=${queryFields}&language=fi&key=${KEY}`);
}

const append = async (place, queryString) => {  
  try {
    const searchResponse = await getGooglePlaceDetails(
      place.googlePlaceId,
      queryString
    );
    const propertiesFromGoogle = searchResponse.data.result;    
    let appendedPlace;     
    appendedPlace = {
      ...place,
      coordinates: propertiesFromGoogle.geometry.location,
      googleRating: propertiesFromGoogle.rating,          
      googleImage: propertiesFromGoogle.photos[0].photo_reference
    };
    return appendedPlace;
  } catch(error) {
    console.log("Error connecting Google API", error);
    return place;
  }
};

const appendPlaces = async places => {
  return await Promise.all(places.map(place => append(place, QUERY_FIELDS_SIMPLE_SEARCH)));
};

const appendSinglePlace = async place => {  
  return await append(place, QUERY_FIELDS_SIMPLE_SEARCH);
}

const getGoogleData = async id => {  
    const response = await getGooglePlaceDetails(id, QUERY_FIELDS_EXTENDED_SEARCH);
    return {
      address: response.data.result.formatted_address,
      googleRating: response.data.result.rating,
      openingHours: response.data.result.opening_hours,
      www: response.data.result.website
    };  
}

module.exports = { appendPlaces, appendSinglePlace, searchGooglePlaceId, getGoogleData };
