var helper = require('../mixins/helper.js');
var carApis = require('./carApiFunctions.js')
var frisby = require('../../../node_modules/frisby/lib/frisby');

var createCarTrip = exports.createCarTrip = function createCarTrip (callback,carCreateTripUrl,scenarioName){
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
   var inputForCheckout = {};
   var cookie ='';
    frisby.create('create call')
    .post(carCreateTripUrl,{strict: false})
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json') 
    .after(function(err,res,body){
      inputForCheckout = getDataForCarCheckout(JSON.parse(body),res);         
      console.log("tripId after create call =>" + inputForCheckout.tripId)
    })
    .after(function(){
    	carApis.callFunction(callback,null,null,inputForCheckout,null,scenarioName);
    })
    .toss(3);
};

var getDataForCarCheckout = function getDataForCarCheckout(json,res){
  var cookie = getCookieFromResponse(res);
	var inputForCheckout = {
            'tripId' : json.tripId,
            'expectedFareCurrencyCode':json.carProduct.detailedFare.grandTotal.currencyCode,
            'totalAmount': json.carProduct.detailedFare.grandTotal.amount,
            'cookie':cookie
          }
          return inputForCheckout;
};

var getCookieFromResponse = function getCookieFromResponse(response){
	      return helper.getCookiesForResponse(response);
};