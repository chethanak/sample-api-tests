
var async = require ('../../../node_modules/async/lib/async');
var helper = require('../mixins/helper.js');
var carHelper = require('../carMixins/carHelper.js');
var carApis = require('../carMixins/carApiFunctions.js');
var carSearch = require('../carMixins/carSearchHelper.js');
var env = "wwwexpediacom.trunk.sb.karmalab.net";

var PICKUP = 90;
var DROPOFF = 92;

  async.series([
  function inValidAirportCode(callback){
     var queryStringForSearch = { 
                       'airportCode': "AAA",
                       'pickupTime': helper.setFutureDate(90).toString(), 
                       'dropOffTime': helper.setFutureDate(92).toString(),
                       'sourceType' : "mobileapp",
                       'siteid': "1"
                     };
      var validateCarError = {
                    errorCode : 'CAR_PRODUCT_NOT_AVAILABLE'
                    };                 
     var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
     carApis.callFunction(carSearch.searchForCar,carSearch.validateError,null,CAR_SEARCH_URL,validateCarError,'Invalid airport code');
     return callback(null);
   }, 
   function inValidDatatypeAirportCode(callback){
     var queryStringForSearch = { 
                       'airportCode': 123,
                       'pickupTime': helper.setFutureDate(PICKUP).toString(), 
                       'dropOffTime': helper.setFutureDate(DROPOFF).toString(),
                       'sourceType' : "mobileapp",
                       'siteid': "1"
                     };
      var airportCodeError = {
                    errorCode : 'INVALID_INPUT',
                    field : "airportCode",
                    cause: "Could not find an airport with the code 123"
                    };                 
     var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
     carApis.callFunction(carSearch.searchForCar,carSearch.validateError,null,CAR_SEARCH_URL,airportCodeError,'Invalid datatype airport code');
     return callback(null);
   }, 
    function pickUpInNextHalfHour(callback){
      var queryStringForSearch = { 
                       'airportCode': "SFO",
                       'pickupTime': helper.setDateWithNextNMinutes(10).toString(), 
                       'dropOffTime': helper.setDateWithNextNMinutes(500).toString(),
                       'sourceType' : "mobileapp",
                       'siteid': "1"
                     };
      var searchWindowError = {
                      'errorCode' : "CAR_SEARCH_WINDOW_VIOLATION",
                      'errorDetails' : "PICKUP_DATE_TOO_EARLY",
                      'maxSearchDurationDays':330,
                      'bookingMaxDaysInAdvance':330,
                      'minSearchDurationHours' :2
                     };               
     var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
     carApis.callFunction(carSearch.searchForCar,carSearch.validateCarSearchWindowViolation,null,CAR_SEARCH_URL,searchWindowError,'Pick up in next half hour');
     return callback(null);
   },
    function pickUpInNextOneHour(callback){
      var queryStringForSearch = { 
                       'airportCode': "SFO",
                       'pickupTime': helper.setDateWithNextNHours(1).toString(), 
                       'dropOffTime': helper.setDateWithNextNHours(2).toString(),
                       'sourceType' : "mobileapp",
                       'siteid': "1"
                     };
      var searchWindowError = {
                      'errorCode' : "CAR_SEARCH_WINDOW_VIOLATION",
                      'errorDetails' : "SEARCH_DURATION_TOO_SMALL",
                      'maxSearchDurationDays':330,
                      'bookingMaxDaysInAdvance':330,
                      'minSearchDurationHours' :2
                     };               
     var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
     carApis.callFunction(carSearch.searchForCar,carSearch.validateCarSearchWindowViolation,null,CAR_SEARCH_URL,searchWindowError,'Pick up in next one hour');
     return callback(null);
   },
 
   function nullDropOffTime(callback){
      var queryStringForSearch = { 
                       'airportCode': "SFO",
                       'pickupTime': helper.setFutureDate(DROPOFF).toString(), 
                       'dropOffTime': '',
                       'sourceType' : "mobileapp",
                       'siteid': "1"
                     };
      var dropOffTimeError = {
                    errorCode : 'INVALID_INPUT',
                    field :'dropOffTime',
                    cause :'Invalid format'
                    };                    
     var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
     carApis.callFunction(carSearch.searchForCar,carSearch.validateError,null,CAR_SEARCH_URL,dropOffTimeError,'Null dropoff time');
     return callback(null);
    },
    function nullPickUpTime(callback){
      var queryStringForSearch = { 
                       'airportCode': "SFO",
                        'pickupTime': '', 
                        'dropOffTime': helper.setFutureDate(DROPOFF).toString(),
                        'sourceType' : "mobileapp",
                        'siteid': "1"
                      };
      var pickupTimeError = {
       field :'pickupTime',
       cause :'Invalid format:',
       errorCode : 'INVALID_INPUT'
      };                
      var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
      carApis.callFunction(carSearch.searchForCar,carSearch.validateError,null,CAR_SEARCH_URL,pickupTimeError,'Null pickup time');
      return callback(null);
    },
   //   function nullAirportCode(callback){
   //   var queryStringForSearch = { 
   //                     'airportCode': '',
   //                     'pickupTime': helper.setFutureDate(PICKUP).toString(), 
   //                     'dropOffTime': helper.setFutureDate(DROPOFF).toString(),
   //                     'sourceType' : "mobileapp",
   //                     'siteid': "1"
   //                   };
   //    var nullAirportCodeErr = {
   //                  errorCode : 'INVALID_INPUT',
   //                  field :'airportCode',
   //                  cause :'may not be empty'
   //                  };                 
   //   var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
   //   carApis.callFunction(carSearch.searchForCar,carSearch.validateError,null,CAR_SEARCH_URL,nullAirportCodeErr,'Null airport code');
   //   return callback(null);
   // },
  function singleCharAirportCode(callback){
     var queryStringForSearch = { 
                       'airportCode': 'A',
                       'pickupTime': helper.setFutureDate(PICKUP).toString(), 
                       'dropOffTime': helper.setFutureDate(DROPOFF).toString(),
                       'sourceType' : "mobileapp",
                       'siteid': "1"
                     };
      var nullAirportCodeErr = {
                    errorCode : 'INVALID_INPUT',
                    field :'airportCode',
                    cause :'size must be between 3 and 3'
                    };                 
     var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
     carApis.callFunction(carSearch.searchForCar,carSearch.validateError,null,CAR_SEARCH_URL,nullAirportCodeErr,'One character airport code');
     return callback(null);
   },
   function pickUpTimeNow(callback){
     var queryStringForSearch = { 
                       'airportCode': 'SFO',
                       'pickupTime': helper.setTodaysDate().toString(), 
                       'dropOffTime': helper.setDateWithNextNMinutes(30).toString(),
                       'sourceType' : "mobileapp",
                       'siteid': "1"
                     };
      var searchCarWindowError = {
                      'errorCode' : "CAR_SEARCH_WINDOW_VIOLATION",
                      'errorDetails' : "PICKUP_DATE_IN_THE_PAST",
                      'maxSearchDurationDays':330,
                      'bookingMaxDaysInAdvance':330,
                      'minSearchDurationHours' :2
                     };                     
     var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
     carApis.callFunction(carSearch.searchForCar,carSearch.validateCarSearchWindowViolation,null,CAR_SEARCH_URL,searchCarWindowError,'Search for Now');
     return callback(null);
   },

   function pickUpInPast(callback){
     var queryStringForSearch = { 
                       'airportCode': 'SFO',
                       'pickupTime': helper.setPastDate(1).toString(), 
                       'dropOffTime': helper.setPastDate(1).toString(),
                       'sourceType' : "mobileapp",
                       'siteid': "1"
                     };
      var searchCarWindowError = {
                      'errorCode' : "CAR_SEARCH_WINDOW_VIOLATION",
                      'errorDetails' : "PICKUP_DATE_IN_THE_PAST",
                      'maxSearchDurationDays':330,
                      'bookingMaxDaysInAdvance':330,
                      'minSearchDurationHours' :2
                     };                     
     var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
     carApis.callFunction(carSearch.searchForCar,carSearch.validateCarSearchWindowViolation,null,CAR_SEARCH_URL,searchCarWindowError,'Search for Now');
     return callback(null);
   },

   function smallSearchWindow(callback){
      var queryStringForSearch = { 
                       'airportCode': "SFO",
                        'pickupTime': helper.setDateWithNextNMinutes(50).toString(), 
                        'dropOffTime':helper.setDateWithNextNHours(2).toString(),
                        'sourceType' : "mobileapp",
                        'siteid': "1"
                      };
       var searchCarWindowError = {
                      'errorCode' : "CAR_SEARCH_WINDOW_VIOLATION",
                      'errorDetails' : "SEARCH_DURATION_TOO_SMALL",
                      'maxSearchDurationDays':330,
                      'bookingMaxDaysInAdvance':330,
                      'minSearchDurationHours' :2
                     };                
      var CAR_SEARCH_URL = carHelper.createCarSearchUrl(env,queryStringForSearch);
      carApis.callFunction(carSearch.searchForCar,carSearch.validateCarSearchWindowViolation,null,CAR_SEARCH_URL,searchCarWindowError,'Search for yesterday');
      return callback(null);
    }
 ],
  function(err, results){
     // results is now equal to: {one: 1, two: 2}
});









