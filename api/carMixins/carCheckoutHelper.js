var helper = require('../mixins/helper.js');
var carApis = require('./carApiFunctions.js')
var frisby = require('../../../node_modules/frisby');

var validateCarCheckout = function validateCarCheckout(json){
	 expect(json.newTrip).toBeDefined();
     expect(json.newTrip.itineraryNumber).toMatch(/\d{1,}/);; 
     expect(json.newTrip.travelRecordLocator).toBeDefined();
     console.log("car itineraryNumber =>"+json.newTrip.itineraryNumber)
};

var checkoutCarTrip = exports.checkoutCarTrip = function checkoutCarTrip(carCheckOutUrl,cookie){  
 process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  frisby.create('booking call')
  .post(carCheckOutUrl)
  .addHeader('cookie', cookie)
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .afterJSON(function(json){
     validateCarCheckout(json);
  })
   .toss();
};

