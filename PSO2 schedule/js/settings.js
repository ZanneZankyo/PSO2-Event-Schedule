var toggleExpired = function () {
    var obj = document.getElementById("expiredToggle").winControl;
    Zankyo.setStorage('showExpired', obj.checked)
    Refresh();
}

var toggleNotifications = function () {
    

    var obj = document.getElementById("notificationToggle").winControl;
    Zankyo.setStorage('pushNotifications', obj.checked);
    console.log('toggleNotifications:' + obj.checked);
    
    var info = Zankyo.getInfo(function (info) {
        console.log(info);
        if (obj.checked)
            Zankyo.pushNotifications(info.events);
        else
            Zankyo.pushTileNotifications(info.events);
    });
    
}

var initToggle = function () {
    return Zankyo.getStorage('showExpired');
}

var initNotification = function () {
    return Zankyo.getStorage('pushNotifications');
}


function Refresh() {
    /*var info = Zankyo.getStorageJSON('info');
    WinJS.UI.Animation.exitContent(document.getElementById('tableView'), null).done(function () {
        buildInfo(info);
        WinJS.UI.Animation.enterContent(document.getElementById('tableView'), null);
    }) */
    Zankyo.getInfo(function (info) {
        WinJS.UI.Animation.exitContent(document.getElementById('tableView'), null).done(function () {
            buildInfo(info);
            WinJS.UI.Animation.enterContent(document.getElementById('tableView'), null);
        })
    })
}

function defaultSettings() {

    //showExpired Setting button
    var showExpired = Zankyo.getStorage('showExpired')
    if (showExpired == undefined || showExpired == null) {
        showExpired = true
        Zankyo.setStorage('showExpired', showExpired);
    }
    var showExpiredSettingsDiv = document.getElementById('expireSetting');

    var existedExpiredToggle = document.getElementById('expiredToggle');
    if (!existedExpiredToggle) {
        var expiredToggle = document.createElement('div');
        expiredToggle.id = 'expiredToggle';
        var expiredToggleCheck = showExpired;

        var showExpiredEventsTitle = 'Show expired events';
        if (window.navigator.language == 'zh-CN')
            showExpiredEventsTitle = '显示过往事件';
        if (window.navigator.language == 'zh-TW' || window.navigator.language == 'zh-HK')
            showExpiredEventsTitle = '顯示過往事件';
        if (window.navigator.language == 'ja-JP')
            showExpiredEventsTitle = '過去のイベントを表示する';

        expiredToggleControl = new WinJS.UI.ToggleSwitch(expiredToggle, { title: showExpiredEventsTitle, checked: expiredToggleCheck, onchange: toggleExpired });
        showExpiredSettingsDiv.appendChild(expiredToggle);
    }

    //pushNotifications Setting button
    var pushNotifications = Zankyo.getStorage('pushNotifications');
    if (pushNotifications == undefined || showExpired == null){
        pushNotifications = true;
        Zankyo.setStorage('pushNotifications', pushNotifications);
    }
    var pushNotificationsSettingsDiv = document.getElementById('notificationSetting');

    var existedNotificationToggle = document.getElementById('notificationToggle');
    if (!existedNotificationToggle) {
        var notificationToggle = document.createElement('div');
        notificationToggle.id = 'notificationToggle';
        var notificationToggleCheck = pushNotifications;

        var notificationTitle = 'Notifications';
        if (window.navigator.language == 'zh-CN')
            notificationTitle = '事件提醒';
        if (window.navigator.language == 'zh-TW' || window.navigator.language == 'zh-HK')
            notificationTitle = '事件提醒';
        if (window.navigator.language == 'ja-JP')
            notificationTitle = 'リマインダー';

        notificationToggleControl = new WinJS.UI.ToggleSwitch(notificationToggle, { title: notificationTitle, checked: notificationToggleCheck, onchange: toggleNotifications });
        pushNotificationsSettingsDiv.appendChild(notificationToggle);
    }

    

    var notificationShips = Zankyo.getStorageJSON('notificationShips');
    if (notificationShips == undefined || showExpired == null) {
        notificationShips = {};
        for (var i = 1; i <= 10; i++) {
            notificationShips[i] = true;
        }
        Zankyo.setStorageJSON('notificationShips', notificationShips);
    }
    console.log('default settings');

    //StartRepeatingWork
    //cancelBackgroundTasks('findRandomEvents');
    //buildBackgroundTasks('findRandomEvents', 15);
}

WinJS.Utilities.markSupportedForProcessing(toggleExpired);
WinJS.Utilities.markSupportedForProcessing(toggleNotifications);
WinJS.Utilities.markSupportedForProcessing(initToggle);
WinJS.Utilities.markSupportedForProcessing(initNotification);