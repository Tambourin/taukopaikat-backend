const httpRedirect = (request, response, next) => {
  if(request.secure) {
    console.log("secure");
    next();
  } else {
    console.log("redirect http");
    response.redirect("https://" + request.headers.host + request.url);
  }
}

module.exports = httpRedirect;