var frisby = require('/Users/ckrishnakumar/node_modules/frisby');
var env = "wwwexpediacom.trunk.sb.karmalab.net"
var checkInDate = "2015-07-12"
var checkOutDate = "2015-07-14"
var cityName = "san+jose"

  frisby.create('Try search call')
  .get("http://"+env+"/m/api/hotel/search?checkInDate="+checkInDate+"&checkOutDate="+checkOutDate+"&city="+cityName+"&resultsPerPage=5&room1=2&sourceType=mobileapp")
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    numberOfMatches: 10,
   })
   .expectJSONTypes({
    numberOfMatches: Number,
    cityList: [],
    })
   .after(function (err, res, body) {
     validateCityList(body,0,6023769,"San Jose","san+jose")
})
.toss();

var validateCityList = function validateCityList(body,index,regionId,cityName,cityUrl){
    expect(JSON.parse(body).cityList[0].regionId).toMatch(regionId)
    expect(JSON.parse(body).cityList[0].cityName).toContain(cityName)
    expect(JSON.parse(body).cityList[0].cityUrl).toContain(cityUrl)
}


  frisby.create('Some other name here')
  .get("http://"+env+"/m/api/hotel/search?checkInDate=2015-07-12&checkOutDate=2015-07-14&city=Bangalore&resultsPerPage=5&room1=2&sourceType=mobileapp&filterUnavailable=true")
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    numberOfRoomsRequested: 1,
    filterUnavailableHotelsRequested: true,
    searchRegionId:"6053307",
    searchRegionCity: "Bengaluru (and vicinity)",
   })
   .expectJSONTypes({
    totalHotelCount: Number,
    availableHotelCount: Number,
    hotelList:[],
    allNeighborhoodsInSearchRegion:[],
    amenityFilterOptions:{},
    starOptions:[],
    priceOptions:[],
    })
   .after(function (err, res, body) {
     expect(JSON.parse(body).hotelList.length).toMatch(5)
     expect("465008").toEqual(JSON.parse(body).hotelList[0].hotelId.toString())
     expect("208.82").toEqual(JSON.parse(body).hotelList[0].lowRate.toString())
     expect("208.82").toEqual(JSON.parse(body).hotelList[0].lowRateInfo.maxNightlyRate.toString())
     expect("417.64").toEqual(JSON.parse(body).hotelList[0].lowRateInfo.total.toString())
     expect("USD").toEqual(JSON.parse(body).hotelList[0].lowRateInfo.currencyCode.toString())
     expect("$").toEqual(JSON.parse(body).hotelList[0].lowRateInfo.currencySymbol.toString())
})
.toss();
