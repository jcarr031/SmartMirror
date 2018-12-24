// Create api object
app.openWeather = {};
// Open Weather Client ID for Calendar app
//app.openWeather.calendar.CLIENT_ID = '568577897581-252evpnp3if8knec60nc4cgs6kv2pefm.apps.googleusercontent.com';
// Open Weather API Key
app.openWeather.API_KEY = 'fbdc14a0a70d6e607bd2e0ed76a2d8b3';

app.openWeather.apiURLS = {
  currentWeather : {
    byCityName : 'http://api.openweathermap.org/data/2.5/weather?q={{city}}',
    byZipCode  : 'http://api.openweathermap.org/data/2.5/weather?zip={{zip}}'
  }
};

app.openWeather.getCurrentWeather = (url) => {
  // Add weather location
  url = url.replace('{{city}}', app.settings.location.city);
  url = url.replace('{{zip}}', app.settings.location.zipCode);
  // url += 'Pittsburgh, US';
  // url += '15222';

  //Set Temp to Fahrenheit cuz 'Murica
  url += `&units=${app.settings.tempUnits}`;

  // Append API Key
  url += `&appid=${app.openWeather.API_KEY}`;

  $.ajax({
           type    : 'GET',
           url     : url, // headers : {'Authorization' : app.openWeather.API_KEY},
           success : function (result) {
             //set your variable to the result
             app.openWeather.setTemp(result);
           },
           error   : function (result) {
             //handle the error
             console.error(`Error : ${result}`);
           }
         });

};

app.openWeather.setTemp = (response) => {
  let strings = {
    temp       : response.main.temp,
    location   : response.name,
    country    : response.sys.country,
    units      : app.settings.tempUnits === 'imperial' ? 'F' : 'C',
    warmHidden : 'none',
    coldHidden : 'none'
  }, lastTemp = app.settings.lastTemp;
  if (lastTemp && strings.temp > lastTemp) {
    strings.warmHidden = 'unset';
  } else if (lastTemp && strings.temp < lastTemp) {
    strings.coldHidden = 'unset';
  }
  app.settings.lastTemp = strings.temp;
  $('#weatherPanel').html(app.getStrings('weather-display', strings));
};
