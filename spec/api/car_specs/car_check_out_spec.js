
var async = require ('../../../node_modules/async/lib/async');
var helper = require('../mixins/helper.js');
var carHelper = require('../carMixins/carHelper.js');
var carApis = require('../carMixins/carApiFunctions.js');
var carSearch = require('../carMixins/carSearchHelper.js');
var carCreateTrip = require('../carMixins/carCreateTripHelper.js');
var carCheckout = require('../carMixins/carCheckoutHelper.js');
var env = "wwwexpediacom.integration.sb.karmalab.net";

var PICKUP = 90;
var DROPOFF = 92;

  async.series([
  function(callback){
      var queryStringForSearch = { 
                       'airportCode': "SFO",
                       'pickupTime': helper.setFutureDate(PICKUP).toString(), 
                       'dropOffTime': helper.setFutureDate(DROPOFF).toString(),
                       'sourceType' : "mobileapp",
                       'siteid': "1"
                     };
    var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
    carApis.callFunction(carSearch.searchForCar,carCreateTrip.createCarTrip,carCheckout.checkoutCarTrip,CAR_SEARCH_URL,null,'End-End-Checkout');
    return callback(null);
  }
 ],
  function(err, results){
     // results is now equal to: {one: 1, two: 2}
});





