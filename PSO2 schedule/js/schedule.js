var updateHour = 16;

function analyzeSchedule(jObj) {

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
