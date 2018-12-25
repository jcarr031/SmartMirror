app.eventReminder = {};

app.eventReminder.showReminder = function () {
    $('#event-reminder-list').html(app.getStrings('event-reminder-popup', {
        ReminderTitle: 'Sample Event Title',
        Time_to_event: '5 minutes'
    }));
    $('div#event-reminder-list').css('left', '25px');
    $('.event-reminder').css('left', '0px');
    setTimeout(function () {
        $('.event-reminder').css('left', '-300px');
        $('div#event-reminder-list').css('left', '-300px');
    }, 10000);
};