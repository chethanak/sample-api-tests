var async = require ('../../../node_modules/async');
var helper = require('../mixins/helper.js');
var carHelper = require('../carMixins/carHelper.js');
var carApis = require('../carMixins/carApiFunctions.js');
var carSearch = require('../carMixins/carSearchHelper.js');
var env = "wwwexpediacom.trunk.sb.karmalab.net";

var PICKUP = 90;
var DROPOFF = 92;

  async.series([
   function validSearch(callback){
      var queryStringForSearch = { 
                       'airportCode': "SFO",
                        'pickupTime': helper.setFutureDate(90).toString(), 
                        'dropOffTime':helper.setFutureDate(330).toString(),
                        'sourceType' : "mobileapp",
                        'siteid': "1"
                      };
      var validationObject = {
           formattedPrice : '$',
           currencyCode :'USD'
      };                
      var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
      carApis.callFunction(carSearch.searchForCar,carSearch.validateCarSearchResponse,null,CAR_SEARCH_URL,validationObject,'Valid Search');
      return callback(null);
    },
  function validSearchFromNext50Mins(callback){
      var queryStringForSearch = { 
                       'airportCode': "SFO",
                        'pickupTime': helper.setDateWithNextNMinutes(50).toString(), 
                        'dropOffTime':helper.setDateWithNextNHours(3).toString(),
                        'sourceType' : "mobileapp",
                        'siteid': "1"
                      };
      var validationObject = {
           formattedPrice : '$',
           currencyCode :'USD'
      };                
      var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
      carApis.callFunction(carSearch.searchForCar,carSearch.validateCarSearchResponse,null,CAR_SEARCH_URL,validationObject,'Valid Search from next 50 mins');
      return callback(null);
    }
 ],
  function(err, results){
     // results is now equal to: {one: 1, two: 2}
});





