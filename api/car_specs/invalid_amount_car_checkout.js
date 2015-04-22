var frisby = require('../../../node_modules/frisby');
var async = require ('../../../node_modules/async');
var helper = require('../mixins/helper.js');
var carHelper = require('../carMixins/carHelper.js');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

frisby.globalSetup({
  timeout: 10000,
  request: {
    headers:{'Accept': 'application/json'},
    inspectOnFailure: true
  }
});


var env = "wwwexpediacom.trunk.sb.karmalab.net";
var productKey = 0;
var totalAmount = 0;
var expectedFareCurrencyCode = 0;
var tripId="";
var cookie="";

var CHECKIN = 90;
var CHECKOUT = 92;

//invalid currency on trip creation
async.series([
  function(callback){
    var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,"SFO",CHECKIN,CHECKOUT,"mobileapp","1");
    searchForCar(callback,CAR_SEARCH_URL);
  },
 function(callback){
    var totalAmount = "string";
    var CAR_CREATE_TRIP_URL = carHelper.createCarCreateTripUrl(env,productKey,totalAmount)
    invalidExpectedTotalFareOnCreateTrip(callback,CAR_CREATE_TRIP_URL);
 }]);


function searchForCar(callback,carSearchUrl){
   frisby.create('Try search call')
  .get(carSearchUrl)
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
   .expectJSONTypes({
    pickupTime:{},
    dropOffTime: {},
    offers: []
    })
   .inspectJSON()
   .after(function (err, res, body) {
    var data = JSON.parse(body).offers
     var index = helper.getIndexOfFirstOccurence(data,'creditCardRequiredToGuaranteeReservation',false)
        if(index > -1){
          productKey = data[index].productKey; 
          totalAmount = data[index].fare.total.amount;
          expectedFareCurrencyCode = data[index].fare.total.currencyCode;
          console.log("productKey from the search => " + productKey);
          console.log("total amount from the search =>" + totalAmount);
          console.log("expected currency from the search => " + expectedFareCurrencyCode);
        }            
    })
    .after(function(){
      callback(helper.printTestDone("invalid amount:searchForCar"));
    })
  .toss();
};

var checkoutCarTrip = function(callback,carCheckOutUrl){  
  frisby.create('booking call')
  .post(carCheckOutUrl)
  .addHeader('cookie', cookie)
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json') 
  .inspectJSON()
   .expectJSONTypes(0, {
      newTrip:{},
      itineraryNumber: Number,
      travelRecordLocator:Number,
      tripId:String,
      orderId:String,
        currencyCode:expectedFareCurrencyCode,
        totalCharges:totalAmount.toString(),
        totalChargesPrice:{},
        formattedPrice:"$"+totalAmount.toString()
    }).after(function(){
       callback(helper.printTestDone("checkoutCarTrip"));
    })
   .toss();
};

var invalidExpectedTotalFareOnCreateTrip = function(callback,carCreateTripUrl){
    frisby.create('create call')
    .post(carCreateTripUrl)
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json') 
    .inspectJSON()
    .afterJSON(function(json) {
      expect(json.errors[0].errorCode).toBeDefined();
      expect(json.errors[0].errorInfo.summary).toContain('Invalid input error');
      expect(json.errors[0].errorInfo.field).toContain('expectedTotalFare');
      expect(json.errors[0].errorInfo.cause).toContain('must match "^[0-9]*(\\.[0-9]{2}){0,1}$"');
    })
    .after(function(){
       callback(helper.printTestDone("createCarTrip"));
    }).toss();
};



