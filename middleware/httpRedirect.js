const httpRedirect = (request, response, next) => {
  if(request.protocol === "https") {
    console.log("secure" + request.protocol);
    next();
  } else {
    console.log("redirect http" + request.protocol);
    response.redirect("https://" + request.headers.host + request.url);
  }
}

module.exports = httpRedirect;