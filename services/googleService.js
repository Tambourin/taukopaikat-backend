const appendPlaceInfo = (places) => {
  return places.map(place => {
    return {...place._doc, extra: "testitestitesti" }
  });
}

module.exports = { appendPlaceInfo };