var moment = require('../../../node_modules/moment/moment');

exports.setTodaysDate = function () {
    return moment().format('YYYY-MM-DDTHH:mm:ss');
};

exports.setDateWithNextNMinutes = function (n) {
    var m = moment().add(n, 'minutes');
    return m.format('YYYY-MM-DDTHH:mm:ss')
};

exports.setDateWithNextNHours = function (n) {
     var m = moment().add(n, 'hours');
    return m.format('YYYY-MM-DDTHH:mm:ss');
};

exports.setFutureDate = function (n) {
    return moment().add(n, 'days').format('YYYY-MM-DDTHH:mm:ss');
};

exports.setPastDate = function (n) {
    return moment().subtract(n, 'days').format('YYYY-MM-DDTHH:mm:ss');
};

//return an array of values that match on a certain key
exports.getValues = function (obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
};


exports.encodeQueryData = function(data)
{
   var str = [];
   for (var d in data)
      str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
   return str.join("&");
};

exports.getCookiesForResponse = function(response){
    var setCookie = response.headers['set-cookie'];
    var cookie ='';
      for (var i = 0, len = setCookie.length; i < len; i++) {
       // console.log(setCookie[i].split(';')[0])
         cookie += setCookie[i].split(';')[0];
          if (i < len - 1)
            cookie += ';'
       }
       return cookie;
}

exports.getIndexOfFirstOccurence = function(data,key,val){
     for(var i=0;i<data.length;i++){
        var obj = data[i];
        for(var eachKey in obj){
             if(eachKey === key && obj[key] === val){ 
                 index = i;     
                 return index;
             }      
        }
  }
};

exports.getValueForTheKey = function(data,index,key){
        var obj = data[index];
        return obj[key]
};

exports.getPaymentDetails = function(){
 var paymentDetails = {
      firstName :'Test User',
      lastName :'Mobile Api',
      email :'testuser@mobileapi.com',
      phoneCountryCode :'1',
      phone :'415-123-1234'
    };
    return paymentDetails;
};

// Extend the default Number object with a formatMoney() method:
// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (2, "$", ",", ".")
 exports.formatMoney = function(val,places, symbol, thousand, decimal) {
  places = !isNaN(places = Math.abs(places)) ? places : 2;
  symbol = symbol !== undefined ? symbol : "$";
  thousand = thousand || ",";
  decimal = decimal || ".";
  var number = val, 
      negative = number < 0 ? "-" : "",
      i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
      j = (j = i.length) > 3 ? j % 3 : 0;
  return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};


