const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }); // expires in 24 h

const getCache = (request, response, next) => {
  const content = cache.get(request.url);    
  if (!content) {    
    return next();
  }      
  console.log("cached");
  return response.status(200).send(content);  
}

const setCache = (request, response, next) => {
  cache.set(request.url, response.locals.data);
  return response.status(200).send(response.locals.data);
}

const updateCache = (request, response, next) => {
  const cacheContent = cache.get(request.url);
  if (!cacheContent) {
    return response.status(200).send(response.locals.data);
  }     
  const updatedPlace = response.locals.data        
  if(Array.isArray(cacheContent)) {
    const updatedContent = cacheContent.map(place => place._id === updatedPlace._id ? updatedPlace : place);
    cache.set(request.url, updatedContent);
  } else {
    cache.set(request.url, updatedPlace);   
  }  
  return response.status(200).send(response.locals.data);
}

const flush = () => cache.flushAll();

module.exports = { getCache, setCache, updateCache, flush };