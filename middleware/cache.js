const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 5 * 60 });

const getCache = (request, response, next) => {  
  const content = cache.get(request.url);  
  if (!content) {
    return next();
  }   
  response.status(200).send(content);  
}

const setCache = (request, response, next) => {
  cache.set(request.url, response.locals.data);
  return response.status(200).send(response.locals.data);
}

const flush = () => cache.flushAll();

module.exports = { getCache, setCache, flush };