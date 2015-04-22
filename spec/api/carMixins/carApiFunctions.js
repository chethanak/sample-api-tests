var frisby = require('../../../node_modules/frisby/lib/frisby');
var helper = require('../mixins/helper.js');
var carHelper = require('./carHelper.js');
var carSearchHelper = require('./carSearchHelper.js');
var env = "wwwexpediacom.trunk.sb.karmalab.net";


var callFunction = exports.callFunction = function callFunction(functionToCall,callback1,callback2,inputObject,validationObject,scenarioName){
	var name = functionToCall.name;
	 console.log('============================================================');
	 console.log('calling test step =>'+scenarioName+':'+name);
	 console.log('============================================================');

	 switch(name){
	 	case 'checkoutCarTrip':
        var validPaymentDetails = helper.getPaymentDetails(); 
        var CAR_CHECKOUT_URL = carHelper.createCarCheckoutTripUrl(env,inputObject.tripId,inputObject.totalAmount,inputObject.expectedFareCurrencyCode,validPaymentDetails,true);       
        functionToCall(CAR_CHECKOUT_URL,inputObject.cookie,scenarioName);
        break;

        case 'createCarTrip':
        var CAR_CREATE_TRIP_URL = carHelper.createCarCreateTripUrl(env,inputObject.productKey,inputObject.totalAmount)
        functionToCall(callback1,CAR_CREATE_TRIP_URL,scenarioName);
        break;

        case 'searchForCar':
        functionToCall(callback1,callback2,inputObject,validationObject,scenarioName);
        break;

        case 'validateError':
        functionToCall(inputObject,validationObject);
        break;

        case 'validateCarSearchWindowViolation':
        functionToCall(inputObject,validationObject);
        break;

        case 'validateCarSearchResponse':
        functionToCall(inputObject,validationObject);
        break;

        default:
          console.log("No function call with the provided name =>" + name);
        break;

	 }
}
