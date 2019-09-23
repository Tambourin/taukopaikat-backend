const googleService = require("../services/googleService");

const testPlaces = [
  {
    name: "ABC Hirvaskangas",
    highway: 4,  
    description: "Tämä on kuvaus",
    images: [ ],  
    services: {
      doesNotBelongToChain: true,
      isOpenTwentyFourHours: true,
      hasPlayground: true,
      hasRestaurant: true,
      hasCofee: true,
      isAttraction: true,
      isGasStation: true,
      isGrill: true
    }
  },
  {
    name: "Vaskikello",
    highway: 5,  
    description: "Tämä taas on kuvaus",
    images: [ ],  
    services: {
      doesNotBelongToChain: false,
      isOpenTwentyFourHours: false,
      hasPlayground: false,
      hasRestaurant: false,
      hasCofee: false,
      isAttraction: false,
      isGasStation: false,
      isGrill: false
    }
  }
];

test("objects in a list are appended with new properties", async () => {
  const newList = await googleService.appendPlaces(testPlaces);
  newList.forEach(element => {
    expect(element).toHaveProperty("address");
    expect(element).toHaveProperty("openingHours");
    expect(element).toHaveProperty("googleRating");
    expect(element).toHaveProperty("coordinates");
  });   
});

