var helper = require('../mixins/helper.js');

exports.createCarSearchUrl = function(env,queryStringForSearch){
   var carSearchEndpoint ='/m/api/cars/search/airport?'
   var queryUrlForSearch = helper.encodeQueryData(queryStringForSearch);
   console.log("http://"+env+carSearchEndpoint+queryUrlForSearch);
   return "http://"+env+carSearchEndpoint+queryUrlForSearch;
};

exports.createCarCreateTripUrl = function(env,productKey,totalAmount){
	var carCreateTripEndPoint = '/m/api/cars/trip/create?'
	var queryStringForCreate = {
     	'productKey': productKey,
     	'expectedTotalFare':totalAmount.toString()
      }
    var queryUrlForCreate = helper.encodeQueryData(queryStringForCreate);
    console.log("https://"+env+carCreateTripEndPoint+queryUrlForCreate);
 return "https://"+env+carCreateTripEndPoint+queryUrlForCreate;
}

exports.createCarCheckoutTripUrl = function(env,tripId,totalAmount,currencyCode,paymentDetails,supressBookingFlag)
{
	var carCheckOutEndPoint ='/m/api/cars/trip/checkout?';
	var queryStringForCheckout = {
     	'tripId': tripId,
     	'expectedTotalFare':totalAmount,
     	'expectedFareCurrencyCode':currencyCode,
     	'mainMobileTraveler.firstName': paymentDetails.firstName,
        'mainMobileTraveler.lastName': paymentDetails.lastName,
        'mainMobileTraveler.email': paymentDetails.email,
        'mainMobileTraveler.phoneCountryCode':paymentDetails.phoneCountryCode,
        'mainMobileTraveler.phone':paymentDetails.phone,
        'suppressFinalBooking':supressBookingFlag
      }
   var queryUrlForCheckout = helper.encodeQueryData(queryStringForCheckout);
   console.log("https://"+env+carCheckOutEndPoint+queryUrlForCheckout)
   return "https://"+env+carCheckOutEndPoint+queryUrlForCheckout;
};



