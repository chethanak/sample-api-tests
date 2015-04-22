
var helper = require('../mixins/helper.js');
var carApis = require('./carApiFunctions.js')
var frisby = require('../../../node_modules/frisby');

frisby.globalSetup({
  timeout: 20000
});

var validateError = exports.validateError = function validateError(body,validateObject){
    var data = JSON.parse(body);
   expect(data.errors).toBeDefined();
   expect(data.errors[0].errorCode).toContain(validateObject.errorCode);
   expect(data.errors[0].errorInfo.summary).toBeDefined();
   if(validateObject.field && validateObject.cause)
   {
        expect(data.errors[0].errorInfo.field).toContain(validateObject.field);
        expect(data.errors[0].errorInfo.cause).toContain(validateObject.cause);
   }
   expect(data.errors[0].diagnosticId).toBe(0);
   expect(data.activityId).toBeDefined();
};

var validateCarSearchWindowViolation = exports.validateCarSearchWindowViolation = function validateCarSearchWindowViolation(body,validateObject){
   var data = JSON.parse(body);
   expect(data.errors).toBeDefined();
   expect(data.errors[0].errorCode).toContain(validateObject.errorCode);
   expect(data.errors[0].errorDetailCode).toContain(validateObject.errorDetails);
   expect(data.errors[0].errorInfo.summary).toBeDefined();
   expect(data.errors[0].errorInfo.validSearchWindow).toBeDefined();
   expect(data.errors[0].errorInfo.validSearchWindow.maxSearchDurationDays).toBe(validateObject.maxSearchDurationDays);
   expect(data.errors[0].errorInfo.validSearchWindow.bookingMaxDaysInAdvance).toBe(validateObject.bookingMaxDaysInAdvance);
   expect(data.errors[0].errorInfo.validSearchWindow.minSearchDurationHours).toBe(validateObject.minSearchDurationHours);
   expect(data.errors[0].diagnosticId).toBe(0);
   expect(data.activityId).toBeDefined();
};


var validateCarSearchResponse = exports.validateCarSearchResponse = function validateCarSearchResponse(data,validationObject){
 validatePickuptime(data);
 validateDropOffTime(data);
 validateOffers(data.offers,0);
 validatePickUpLocation(data.offers,0);
 validateDropOffLocation(data.offers,0);
 validateFare(data.offers,0);
 validateTotal(data.offers,0);
}

var validatePickuptime = function validatePickuptime(data){
   expect(data.pickupTime).toBeDefined();
   expect(data.pickupTime.raw).toBeDefined();
   expect(data.pickupTime.localized).toBeDefined(); 
   expect(data.pickupTime.epochSeconds).toBeDefined(); 
   expect(data.pickupTime.timeZoneOffsetSeconds).toBeDefined(); 
   expect(data.pickupTime.localizedShortDate).toBeDefined(); 
}

var validateDropOffTime = function validateDropOffTime(data){
   expect(data.dropOffTime).toBeDefined();
   expect(data.dropOffTime.raw).toBeDefined();
   expect(data.dropOffTime.localized).toBeDefined(); 
   expect(data.dropOffTime.epochSeconds).toBeDefined(); 
   expect(data.dropOffTime.timeZoneOffsetSeconds).toBeDefined(); 
   expect(data.dropOffTime.localizedShortDate).toBeDefined(); 
}

var validateOffers = function validateOffers(data,index){
   expect(data[index].productKey).toBeDefined();
   expect(data[index].vendor.id).toBeDefined();
   expect(data[index].vendor.name).toBeDefined(); 
   expect(data[index].vendor.code).toBeDefined(); 
   expect(data[index].creditCardRequiredToGuaranteeReservation).toBeDefined(); 
   expect(data[index].pickUpLocation).toBeDefined(); 
   expect(data[index].dropOffLocation).toBeDefined(); 
   expect(data[index].fare).toBeDefined(); 
   expect(data[index].hasFreeCancellation).toBe(true); 
   expect(data[index].hasUnlimitedMileage).toBe(true);
   expect(data[index].vehicleInfo).toBeDefined();
};

var validatePickUpLocation = function validatePickUpLocation(data,index){
  expect(data[index].pickUpLocation.locationType).toBeDefined();
  expect(data[index].pickUpLocation.locationType).toBeDefined();
  expect(data[index].pickUpLocation.airportInstructions).toBeDefined();
   expect(data[index].pickUpLocation.latitude).toBeDefined();
   expect(data[index].pickUpLocation.longitude).toBeDefined();
  expect(data[index].pickUpLocation.locationCode).toBeDefined();
};

var validateDropOffLocation = function validateDropOfFLocation(data,index){
  expect(data[index].dropOffLocation.locationType).toBeDefined();
  expect(data[index].dropOffLocation.locationDescription).toBeDefined();
  expect(data[index].dropOffLocation.latitude).toBeDefined();
  expect(data[index].dropOffLocation.longitude).toBeDefined();
  expect(data[index].dropOffLocation.locationCode).toBeDefined();
}

var validateFare = function validateFare(data,index){
   expect(data[index].fare.rateTerm).toBeDefined();
   expect(data[index].fare.rate.amount).toMatch(/^\d+\.\d{0,2}$/);
   expect(data[index].fare.rate.formattedPrice).toMatch(/\d+\.\d{0,2}$/);
   expect(data[index].fare.rate.formattedWholePrice.replace(/[^0-9-.]/g, '')).toMatch(/\d+$/);
   expect(data[index].fare.rate.currencyCode).toBeDefined();
};

var validateTotal = function validateTotal(data,index){
  expect(data[index].fare.total.amount).toBeDefined();
  expect(data[index].fare.total.formattedPrice).toBeDefined();
  expect(data[index].fare.total.formattedWholePrice).toBeDefined();
  expect(data[index].fare.total.currencyCode).toBeDefined();
}


var getInputForCreateTrip = function getInputForCreateTrip(body){
  var data = JSON.parse(body).offers;
  var inputForCarCreateTrip;
     var index = helper.getIndexOfFirstOccurence(data,'creditCardRequiredToGuaranteeReservation',false)
        if(index > -1){
          inputForCarCreateTrip ={
            'productKey' : data[index].productKey,
            'totalAmount': data[index].fare.total.amount,
            'expectedFareCurrencyCode':data[index].fare.total.currencyCode 
          }
          console.log("productKey from the search => " + inputForCarCreateTrip.productKey);
          console.log("total amount from the search =>" + inputForCarCreateTrip.totalAmount);
          console.log("expected currency from the search => " + inputForCarCreateTrip.expectedFareCurrencyCode);
          return inputForCarCreateTrip;
   }
};

var searchForCar = exports.searchForCar = function searchForCar(callback,callback2,carSearchUrl,validationObject,scenarioName){
 process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  var inputForCreateTrip={};
   frisby.create('Try search call')
  .get(carSearchUrl)
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
   .after(function(err, res, body){
    var data = JSON.parse(body);
    if(data.hasOwnProperty('errors') === true){
      carApis.callFunction(callback,null,null,body,validationObject,scenarioName);              
    }
    else if(callback.name === 'createCarTrip'){
     // validateCarSearchResponse(data); 
      var inputForCreateTrip = getInputForCreateTrip(body);  
      carApis.callFunction(callback,callback2,null,inputForCreateTrip,null,scenarioName);   
    }
    else {
       carApis.callFunction(callback,null,null,data,validationObject,scenarioName); 
      //validateCarSearchResponse(data);
    }
   })
  .toss(3);
};


