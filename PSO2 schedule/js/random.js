function FindRandomEvents() {
    $('#find-btn').text('Finding Random Quests');
    $.ajax({
        url: 'https://twitter.com/pso2_emg_hour',
        dataType: 'text',
        cache: false
    }).done(function (data) {
        var jObj = $(data);
        AnalyzeRandomEvents(jObj);
        $('#find-btn').text('Latest Random Quests');
    });
    
}

function AnalyzeRandomEvents(jObj) {
    var item = jObj.find('li.stream-item div.content').filter(function () {
        return /\d+\:/.test( $(this).find('p.tweet-text').text())
    }).first();
    var itemTime = new Date(item.find('._timestamp').data('time-ms'));

    var eventTime = new Date(itemTime);
    eventTime.setHours(itemTime.getHours() + 1, 0, 0, 0);
    //eventTime = new Date(Date.now() + 15 * 60 * 1000 + 1000); //test
    console.log('event time:' + eventTime);

    var text = item.find('p.tweet-text').text().split(/＞\n/)[1].replace(/　*\#PSO2/, '');
    console.log(text);
    var shipTexts = text.split('\n');
    console.log(shipTexts);

    var shipEvent = [];
    for (var i in shipTexts) {
        var ship = parseInt(shipTexts[i].split(':')[0]);
        var name = (shipTexts[i].split(':')[1]);
        //console.log('test ' + name + ':' + !/\[|\(|\―/.test(name));
        if (!/\[|\(|\―/.test(name))
            shipEvent.push({ ship: ship, name: name});
    }
    console.log(shipEvent);
    var notificationShips = Zankyo.getStorageJSON('notificationShips');
    var message = '';
    for (var i in shipEvent) {
        if (notificationShips[shipEvent[i].ship] == true) {
            message += 'Ship' + shipEvent[i].ship + '「' + shipEvent[i].name + '」, ';
        }
    }
    if (message.length > 0 || Date.now() < eventTime) {
        message = message.slice(0, message.length - 2);
        var event = {
            name: message,
            time: eventTime.getTime()
        }
        Zankyo.pushRandomEventNotification(event);
    }
    
}

function StartRepeatingWork() {
    var job = WinJS.Utilities.Scheduler.schedule(RepeatWork);
}

function RepeatWork() {
    FindRamdomEvents()
    console.log('work repeated');
    WinJS.Promise.timeout(10000).then(RepeatWork);
}