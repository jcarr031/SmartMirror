$(document).ready(() => {
  app.init();
  app.loop();
});

// MainApp object
let app = {};

app.init = () => {
  setTimeout(() => {
    app.updateTime();
  }, (new Date().getTime() / 1000) % 1 * 1000);
  app.setupEvents();
  app.openWeather.getCurrentWeather(app.openWeather.apiURLS.currentWeather.byCityName);
};

app.loop = () => {
  setTimeout(() => {
    app.loop();
  }, (1000 * 60 * 10));
  app.openWeather.getCurrentWeather(app.openWeather.apiURLS.currentWeather.byCityName);
};

app.setupEvents = () => {
  $('li#users').on('click', function (e) {
    if (e.currentTarget.className.indexOf('active') > 0) {
      $(e.currentTarget).removeClass('active');
      app.google.signoutButton.click();
      app.hideCalendarEvents();
    } else {
      $(e.currentTarget).addClass('active');
      app.google.authorizeButton.click();
    }
  });
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
  let source   = document.getElementById(templateID).innerHTML,
      template = Handlebars.compile(source);

  return template(strings)
};
/*END UTILITY FUNCTIONS*/

app.updateTime = () => {
  //reset the timeout to update the time
  setTimeout(() => {
    app.updateTime();
  }, 1000);

  let context         = {
        date    : '01/01/1970',
        hours   : 0,
        minutes : 0,
        seconds : 0,
        amPM    : 0
      },
      currentDateTime = new Date();

  context.date = currentDateTime.toLocaleDateString();
  context.hours = currentDateTime.getHours().zeroPad(2);
  context.minutes = currentDateTime.getMinutes().zeroPad(2);
  context.seconds = currentDateTime.getSeconds().zeroPad(2);
  context.amPM = context.hours >= 12 ? 'PM' : 'AM';

  $('#dateTimeDisplay').html(app.getStrings('time-display', context));
};
