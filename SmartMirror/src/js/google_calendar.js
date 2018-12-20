// Add a google object to app
app.google = {};
// Add Calendar to google object
app.google.calendar = {};
// Google Calendar Client ID for Calendar app
app.google.calendar.CLIENT_ID = '568577897581-252evpnp3if8knec60nc4cgs6kv2pefm.apps.googleusercontent.com';
// Google Calendar API Key
app.google.calendar.API_KEY = 'AIzaSyDJa5OqTBJKXekB1g2MPlg21Zgd_pCaquQ';
// Google Calendar Discovery Docs
app.google.calendar.DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
// Google Calendar Scopes
app.google.calendar.SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

//authorization and Sign out buttons for google
app.google.authorizeButton = document.getElementById('authorize_button');
app.google.signoutButton = document.getElementById('signout_button');

// Google Libs and APIs started on page load
app.google.calendar.handleClientLoad = () => {
  gapi.load('client:auth2', app.google.calendar.initClient);
};

//Initialize APIs
app.google.calendar.initClient = () => {
  gapi.client.init({
                     apiKey        : app.google.calendar.API_KEY,
                     clientId      : app.google.calendar.CLIENT_ID,
                     discoveryDocs : app.google.calendar.DISCOVERY_DOCS,
                     scope         : app.google.calendar.SCOPES
                   }).then(() => {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(app.google.calendar.updateSigninStatus);

    // Handle the initial sign-in state.
    app.google.calendar.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    app.google.authorizeButton.onclick = app.google.calendar.handleAuthClick;
    app.google.signoutButton.onclick = app.google.calendar.handleSignoutClick;
  }, (error) => {
    // Show API error in calendar pane
    app.google.calendar.appendEvents(JSON.stringify(error, null, 2));
  });
};

// Update user sign in status
app.google.calendar.updateSigninStatus = (isSignedIn) => {
  if (isSignedIn) {
    app.google.calendar.listUpcomingEvents();
  }
};

// Allow user to sign in to google
app.google.calendar.handleAuthClick = (event) => {
  gapi.auth2.getAuthInstance().signIn();
};

// Sign out of google
app.google.calendar.handleSignoutClick = (event) => {
  gapi.auth2.getAuthInstance().signOut();
};

app.google.calendar.appendEvents = (message) => {
  $('#eventList').append(message);
  app.showCalendarEvents();
};

//list Any upcoming events
app.google.calendar.listUpcomingEvents = () => {
  gapi.client.calendar.events.list({
                                     'calendarId'   : 'primary',
                                     'timeMin'      : (new Date()).toISOString(),
                                     'showDeleted'  : false,
                                     'singleEvents' : true,
                                     'maxResults'   : 10,
                                     'orderBy'      : 'startTime'
                                   }).then(function (response) {
    let events = response.result.items, context = {
      title     : '',
      startTime : '',
      endTime   : ''
    };
    $('#eventList').html('');
    if (events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        let event = events[i];
        context.title = event.summary;
        if(event.start.dateTime){
          context.startTime = new Date(event.start.dateTime).toLocaleString();
        }else{
          context.startTime = new Date(event.start.date).toLocaleDateString();
        }
        if(event.end.dateTime){
          context.endTime = new Date(event.end.dateTime).toLocaleString();
        }else{
          context.endTime = new Date(event.end.date).toLocaleDateString();
        }
        // context.startTime = new Date(event.start.dateTime || event.start.date).toLocaleString();
        // context.endTime = new Date(event.end.dateTime || event.end.date).toLocaleDateString();
        app.google.calendar.appendEvents(app.getStrings('calendarEvent', context));
      }
    } else {
      app.google.calendar.appendEvents('No upcoming events found.');
    }
  }).then(() => {
    $('#users').addClass('active');
    app.CALENDAR_ENABLED = true;
  }).catch((e) => {
    console.error(`Error Occured while fetching events : ${e}`);
    app.CALENDAR_ENABLED = false;
  });
};
