var updateHour = 16;

$(function () {

    "use strict";
    console.log(window.navigator.language);

    if (window.navigator.language == 'zh-CN')
    {
        $("#analyze-btn").text('分析时间表');
        $("#find-btn").text('查找最近的随机紧急');
        $('#info').text('请点击"分析时间表"');
        $('#app-title').text('事件时间表');
    }
    if (window.navigator.language == 'zh-TW' || window.navigator.language == 'zh-HK')
    {
        $("#analyze-btn").text('分析時間表');
        $("#find-btn").text('查找最近的隨機緊急');
        $('#info').text('請點擊"分析時間表"');
        $('#app-title').text('事件時間表');
    }
    if (window.navigator.language == 'ja-JP')
    {
        $("#analyze-btn").text('スケジュール分析開始');
        $("#find-btn").text('最新ランダム緊急を探す');
        $("#find-btn").text('「スケジュール分析開始」をクリックしてください');
        $('#app-title').text('イベントスケジュール');
    }

    //var applicationData = Windows.Storage.ApplicationData.current;

    //var localSettings = applicationData.localSettings;

    /*var savedInfo = Zankyo.getStorageJSON('info');
    if (savedInfo) {
        //savedInfo = JSON.parse(savedInfo);
        $('#info').text(savedInfo.week);
        buildInfo(savedInfo);
        WinJS.UI.Animation.enterPage(document.getElementsByClassName('one-day'), null);
    }*/

    Zankyo.getInfo(function (info) {
        if (info) {
            $('#info').text(info.week);
            buildInfo(info);
            WinJS.UI.Animation.enterPage(document.getElementsByClassName('one-day'), null);
        }
    })

    $('#analyze-btn').click(startAnalyze);
    $('#find-btn').click(FindRandomEvents);
})

function startAnalyze() {
    var keyword = '予告イベント';

    var btn = $('#analyze-btn');

    console.log(window.navigator.language);
    if (window.navigator.language == 'zh-CN')
        btn.text('分析中……');
    else if (window.navigator.language == 'zh-TW' || window.navigator.language == 'zh-HK')
        btn.text('分析中……');
    else if (window.navigator.language == 'ja-JP')
        btn.text('分析中・・・');
    else
        btn.text('Analyzing......');

    WinJS.UI.Animation.exitContent(document.getElementById('tableView'), null).done(function () { });
    $('progress').animate({ top: '10px' }, 500);

    $.ajax({
        url: 'http://pso2.jp/players/news/?mode=event',
        dataType: 'text',
        cache: false
    }).done(function (data) {
        var jObj = $(data);
        var latest = jObj.find('dd a').filter(function () {
            return new RegExp(keyword).test($(this).text());
        }).first();
        console.log(latest.text());
        var week = latest.text().split('の')[0];
        $('#info').text(week);

        $.ajax({
            url: 'http://pso2.jp/players/news' + latest.attr('href').split(/\./)[1],
            dataType: 'text',
            cache: false
        }).done(function (data) {
            jObj = $(data);
            var info = analyzeSchedule(jObj);
            console.log(info);
            buildInfo(info);
            WinJS.UI.Animation.enterContent(document.getElementById('tableView'), null);
            Zankyo.pushNotifications(info.events);

            if (window.navigator.language == 'zh-CN')
                btn.text('分析时间表');
            else if (window.navigator.language == 'zh-TW' || window.navigator.language == 'zh-HK')
                btn.text('分析時間表');
            else if (window.navigator.language == 'ja-JP')
                btn.text('スケジュール分析開始');
            else
                btn.text('Analyze Schedule');

            $('progress').animate({ top: '-10px' }, 500);
            info.week = week;
            //Zankyo.setStorageJSON('info', info);
            Zankyo.setInfo(info);
            //localSettings.values['info'] = JSON.stringify(info);
        });
    });
}

function buildInfo(info) {
    //buildTable(info);
    $('#tableView').empty();
    buildRow(info);

}

function buildRow(info) {
    var events = info.events;

    var schedule = {};
    for (var i in events) {

        var applicationData = Windows.Storage.ApplicationData.current;
        var localSettings = applicationData.localSettings;
        if (!Zankyo.getStorage('showExpired') && events[i].time + 60 * 60 * 1000 < Date.now())
            continue;

        var date = new Date(events[i].time);
        var dateStr = pad(date.getMonth() + 1, 2) + '/' + pad(date.getDate(), 2);
        if (schedule[dateStr] == undefined)
            schedule[dateStr] = [];
        schedule[dateStr].push(events[i]);
    }

    for (var i in schedule) {

        var table = $('#tableView')
        table.append('<div class="one-day"><div class="date">' + i + '</div></div>');
        var day = table.find('.one-day').last();

        for (var j in schedule[i]) {
            var event = schedule[i][j];
            day.append('<div class="event"><div class="time">' + event.timeStr + '</div><div class="name">' + event.name + '</div></div>');
        }
    }
}

/*function buildTable(info) {
    var events = info.events;
    var times = info.times;

    $('#tableView').html('<table id="tableWarp" class="table" cellspacing="0"></table>');
    var header = '<tr><th>Time (Local)</th>';
    var html = '<tr><td class="date"></td>';
    for (var i in times) {
        header += '<th>' + times[i] + '</th>';
        html += '<td data-time="' + times[i] + '"></td>';
    }
    header += '</tr>';
    html += '</tr>';
    $('#tableWarp').append(header);

    var schedule = {};
    for (var i in events) {
        var date = new Date(events[i].time);
        var dateStr = pad(date.getMonth() + 1, 2) + '/' + pad(date.getDate(), 2);
        if (schedule[dateStr] == undefined)
            schedule[dateStr] = [];
        schedule[dateStr].push(events[i]);
    }
    console.log(schedule);

    for (var i in schedule) {
        $('#tableWarp').append(html);
        $('#tableWarp').find('.date').last().text(i);

        for (var j in schedule[i]) {
            var event = schedule[i][j];
            var eventTime = new Date(event.time);
            $('#tableWarp').find('td[data-time="' + event.timeStr + '"]').last().text(event.name);
        }
    }
}  */

function formatDate(time) {
    var date = new Date(time);
    return pad(date.getMonth() + 1, 2) + '/' + pad(date.getDate(), 2) + ' ' + pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2);
}

function formatTime(time) {
    var date = new Date(time);
    return pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2);
}

function pad(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}