$(document).ready(() => {
  //app.init();
  //app.loop();
});

// MainApp object
let app = {
  google : {}
};
app.REFRESH_RATE = 600000; // Refresh Interval in milliseconds
app.CALENDAR_ENABLED = false; // Refresh Interval in milliseconds
app.init = () => {
  setTimeout(() => {
    app.updateTime();
  }, (new Date().getTime() / 1000) % 1 * 1000);
  app.setupEvents();
  app.populatePopups();
  app.loadSettings();
  // Get Weather Info
  app.openWeather.getCurrentWeather(app.openWeather.apiURLS.currentWeather.byCityName);
  // Start Calendar Client
  app.google.calendar.handleClientLoad();

  // after setup is done, run loop function
  app.loop();
};

app.loop = () => {
  setTimeout(() => {
    app.loop();
  }, app.REFRESH_RATE);
  app.openWeather.getCurrentWeather(app.openWeather.apiURLS.currentWeather.byCityName);
  if (app.CALENDAR_ENABLED) {
    app.google.calendar.listUpcomingEvents();
  }
  console.log(`Updated: ${new Date().toString()}`);
};

app.setupEvents = () => {
  $('li#users').on('click', (e) => {
    if (e.currentTarget.className.indexOf('active') > 0) {
      app.google.signoutButton.click();
      $(e.currentTarget).removeClass('active');
      app.CALENDAR_ENABLED = false;
      app.hideCalendarEvents();
    } else {
      app.google.authorizeButton.click();
    }
  });
  $('li.navButton').on('click', (e) => {
    app.popup.toggle(e);
  });
};
app.populatePopups = () => {
  let strings = {};
  $('#weather .popup').html(app.getStrings('weather-popup', strings));
};
app.hideCalendarEvents = () => {
  $('#calendarPanel').css('left', '-200px');
};
app.showCalendarEvents = () => {
  $('#calendarPanel').css('left', '0');
};

/*BEGIN UTILITY FUNCTIONS*/
app.utilities = {};
Number.prototype.zeroPad = function (digitCount) {
  let currentLength = this.toString().length, output = '';

  digitCount -= currentLength;

  while (digitCount > 0) {
    output += '0';
    digitCount--;
  }

  return output + this.toString();
};
app.getStrings = (templateID, strings) => {
  let source = document.getElementById(templateID).innerHTML, template = Handlebars.compile(source);

  return template(strings);
};
/*END UTILITY FUNCTIONS*/

app.updateTime = () => {
  //reset the timeout to update the time
  setTimeout(() => {
    app.updateTime();
  }, 1000);

  let context        = {
    date    : '01/01/1970',
    hours   : 0,
    minutes : 0,
    seconds : 0,
    amPM    : 0
  }, currentDateTime = new Date();

  context.date = currentDateTime.toLocaleDateString();
  context.hours = (currentDateTime.getHours() % 13 + 1).zeroPad(2);
  context.minutes = currentDateTime.getMinutes().zeroPad(2);
  context.seconds = currentDateTime.getSeconds().zeroPad(2);
  context.amPM = (currentDateTime.getHours()) >= 12 ? 'PM' : 'AM';

  $('#dateTimeDisplay').html(app.getStrings('time-display', context));
};

app.popup = {};
app.popup.toggle = (e) => {
  $('.popup').not($(e.currentTarget).find('.popup')).hide();
  $(e.currentTarget).find('.popup').toggle();
};

/*Config default settings*/
app.settings = {
  tempUnits   : 'metric',
  refreshRate : 10, //in minutes?
  location    : {
    zipCode : 15222,
    city    : 'Pittsburgh,US'
  },
  lastTemp    : null
};

app.loadSettings = () => {
  Object.assign(app.settings, JSON.parse(localStorage.getItem('mirrorSettings')) || app.settings);

  app.REFRESH_RATE = app.settings.refreshRate * (1000 * 60);
};

app.saveSettings = () => {
  localStorage.setItem('mirrorSettings', JSON.stringify(app.settings));

  app.REFRESH_RATE = app.settings.refreshRate * (1000 * 60);
};
