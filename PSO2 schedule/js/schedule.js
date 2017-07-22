var updateHour = 16;

function analyzeSchedule(jObj) {

    var maintanceEnd = '17:00';
    var maintanceStart = '11:00';

    if (!jObj.find("div .eventTable").length)
        return undefined;

    var schedule = {};
    var times = [];
    var events = [];
    var currentDate = new Date(new Date().getTime() - 9 * 60 * 60 * 1000 - new Date().getTimezoneOffset() * 60 * 1000);
    var localDateOffset = -9 * 60 * 60 * 1000 - new Date().getTimezoneOffset() * 60 * 1000;

    var firstTime = null;

    var week = jObj.find('li.pager--date').text();

    jObj.find('div.event-emergency, div.event-live, div.event-casino').each(function () {

        var event = {};

        var startYear = currentDate.getFullYear();
        var startDateStrs = $(this).find('.start').text();
        var startMonth = parseInt(startDateStrs.split('/')[0]);
        var startDate = parseInt(startDateStrs.split('/')[1]);

        var startTimeStrs = $(this).find('.start')[0].nextSibling.nodeValue.replace('～','');
        var startHour = parseInt(startTimeStrs.split(':')[0]);
        var startMinute = parseInt(startTimeStrs.split(':')[1]);

        var endYear = currentDate.getFullYear();
        var endDateStrs = $(this).find('.end').text();
        var endMonth = parseInt(endDateStrs.split('/')[0]);
        var endDate = parseInt(endDateStrs.split('/')[1]);

        var endTimeStrs = $(this).find('.end')[0].nextSibling.nodeValue;
        var endHour = parseInt(endTimeStrs.split(':')[0]);
        var endMinute = parseInt(endTimeStrs.split(':')[1]);

        var time = new Date();
        time.setFullYear(startYear);
        time.setMonth(startMonth - 1);
        time.setDate(startDate);
        time.setHours(startHour, startMinute, 0, 0);
        time = new Date(time.getTime() + localDateOffset);

        var endTime = new Date();
        endTime.setFullYear(endYear);
        endTime.setMonth(endMonth - 1);
        endTime.setDate(endDate);
        endTime.setHours(endHour, endMinute, 0, 0);
        endTime = new Date(endTime.getTime() + localDateOffset);

        if (!firstTime)
            firstTime = time;
        else if (time.getMonth() == 0 && firstTime.getMonth() == 11)
            time.setFullYear(firstTime.getFullYear() + 1);

        if (endTime.getMonth() == 0 && firstTime.getMonth() == 11)
            endTime.setFullYear(firstTime.getFullYear() + 1);

        event.time = time.getTime();
        event.endTime = endTime.getTime();

        var eventName = $(this).find('dd').last().text();

        event.name = eventName;
        if(endTime - time>30*60*1000)
            event.timeStr = pad(time.getHours(), 2) + ':' + pad(time.getMinutes(), 2) + "~" + pad(endTime.getHours(), 2) + ':' + pad(endTime.getMinutes(), 2);
        else
            event.timeStr = pad(time.getHours(), 2) + ':' + pad(time.getMinutes(), 2);

        events.push(event);
    });
    events.sort(function (a, b) {
        var delta = a.time - b.time;
        return delta < 0 ? -1 : delta == 0 ? 0 : 1;
    });

    /*times.sort(function (a, b) {
        var aH = a.split(/:/)[0];
        var aM = a.split(/:/)[1];
        var bH = b.split(/:/)[0];
        var bM = b.split(/:/)[1];
        if (aH != bH) return aH - bH;
        else return aM - bM;
    });*/

    return { events: events, times: times, week: week };
}

function analyzeSchedule2(jObj) {

    var maintanceEnd = '17:00';
    var maintanceStart = '11:00';

    if (!jObj.find("h3:contains('イベントスケジュール')").length)
        return undefined;

    var schedule = {};
    var times = [];
    var events = [];
    var currentDate = new Date(new Date().getTime() - 9 * 60 * 60 * 1000 - new Date().getTimezoneOffset() * 60 * 1000);

    jObj.find('.tableWrap').each(function () {
        var info = {};
        info.dateStr = $(this).prev().text();

        if (/^\d+月\d+日（.）$/.test(info.dateStr)) {

            var dateStrs = info.dateStr.split(/月|日/);
            var month = dateStrs[0];
            var day = dateStrs[1];
            info.date = new Date();
            info.date.setMonth(parseInt(month) - 1);
            info.date.setDate(parseInt(day));
            info.date.setHours(0, 0, 0, 0);

            info.date = new Date(info.date.getTime() - 9 * 60 * 60 * 1000 - info.date.getTimezoneOffset() * 60 * 1000);

            if (currentDate.getMonth() == 11 && info.date.getMonth() == 0) {
                info.date.setFullYear(info.date.getFullYear() + 1);
            }

            $(this).find('tr:not(:first-child)').each(function () {
                var event = {};
                event.timeStr = $(this).children().first().text();
                event.type = $(this).children().first().next().find('img').attr('alt');
                event.name = $(this).children().last().text();

                if (/メンテナンス終了後/.test(event.timeStr)) {
                    event.timeStr = event.timeStr.replace('メンテナンス終了後', maintanceEnd);
                }
                if (/メンテナンス開始まで/.test(event.timeStr)) {
                    event.timeStr = event.timeStr.replace('メンテナンス開始まで', maintanceStart);
                }
                if (/終日/.test(event.timeStr)) {
                    event.timeStr = event.timeStr.replace('終日', '0:00 ～ 23:59');
                }
                if (/\d+:\d+/.test(event.timeStr)) {
                    var timeStrs = event.timeStr.split(/:| /);
                    var hour = timeStrs[0];
                    var minute = timeStrs[1];
                    event.time = new Date(info.date.getTime() + parseInt(hour) * 60 * 60 * 1000 + parseInt(minute) * 60 * 1000);
                    event.timeStr = pad(event.time.getHours(), 2) + ':' + pad(event.time.getMinutes(), 2);
                    //console.log(event.name + ":" + event.type);
                    if ((event.type == '緊急' || event.type == 'ライブ') && !new RegExp(event.timeStr).test(times.toString()))
                        times.push(event.timeStr);
                }
                event.time = event.time.getTime();
                //save 緊急 event only
                if (event.type == '緊急' || event.type == 'ライブ')
                    events.push(event);
            });
            //save 緊急 event only
        }
    });
    times.sort(function (a, b) {
        var aH = a.split(/:/)[0];
        var aM = a.split(/:/)[1];
        var bH = b.split(/:/)[0];
        var bM = b.split(/:/)[1];
        if (aH != bH) return aH - bH;
        else return aM - bM;
    });

    return { events: events, times: times };
}
