const httpToHttpsRedirect = (request, response, next) => {
  if(request.protocol === "https") {
    next();
  } else {
    if(process.env.NODE_ENV === "production") {
      console.log("redirect http" + request.protocol);
      response.redirect("https://" + request.headers.host + request.url);
    } else {
      next();
    }    
  }
}

module.exports = httpToHttpsRedirect;