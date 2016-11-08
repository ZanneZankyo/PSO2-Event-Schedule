function FindRandomEvents() {

    var btn = $('#find-btn');
    if (window.navigator.language == 'zh-CN')
        btn.text('查找中……');
    else if (window.navigator.language == 'zh-TW' || window.navigator.language == 'zh-HK')
        btn.text('查找中……');
    else if (window.navigator.language == 'ja-JP')
        btn.text('検索中・・・');
    else
        btn.text('Searching......');
    
    $.ajax({
        url: 'https://twitter.com/pso2_emg_hour',
        dataType: 'text',
        cache: false
    }).done(function (data) {
        var jObj = $(data);
        AnalyzeRandomEvents(jObj);

        if (window.navigator.language == 'zh-CN')
            btn.text('查找最近的随机紧急');
        else if (window.navigator.language == 'zh-TW' || window.navigator.language == 'zh-HK')
            btn.text('查找最近的隨機緊急');
        else if (window.navigator.language == 'ja-JP')
            btn.text('最新ランダム緊急を探す');
        else
            btn.text('Search Latest Random Quests');
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
    if (message.length <= 0)
    {
        if (window.navigator.language == 'zh-CN')
            message = '没有找到随机紧急。';
        else if (window.navigator.language == 'zh-TW' || window.navigator.language == 'zh-HK')
            message = '沒有找到隨機緊急。';
        else if (window.navigator.language == 'ja-JP')
            message = 'ランダム緊急が見つかりませんでした。';
        else
            message = 'No random quests found.';
    }
    else
        message = message.slice(0, message.length - 2);
    if (true/*message.length > 0 && Date.now() < eventTime + 30*60*1000*/) {
        
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