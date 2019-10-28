const testPlaces = [
  {
    name: "ABC Hirvaskangas",
    highway: 4,  
    description: "Tämä on kuvaus",
    city: "Äänekoski",
    images: [ ],  
    services: {
      doesNotBelongToChain: false,
          isOpenTwentyFourHours: false,
          hasBeenAvarded: false,
          isAttraction: false,
          isSummerCafe: false,
          isGasStation: false,
          isGrill: false
    }
  },
  {
    name: "Vaskikello",
    highway: 5,  
    description: "Tämä taas on kuvaus",
    images: [ ], 
    googlePlaceId: "ChIJ7cx_1bTkg0YR9k5VgEpmM5I", 
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

module.exports = testPlaces;