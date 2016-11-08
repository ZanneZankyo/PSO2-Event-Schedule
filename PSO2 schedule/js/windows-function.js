var Zankyo = {
    getStorage: function (key) {
        var applicationData = Windows.Storage.ApplicationData.current;
        var localSettings = applicationData.localSettings;
        return localSettings.values[key];
    },
    setStorage: function (key, obj) {
        var applicationData = Windows.Storage.ApplicationData.current;
        var localSettings = applicationData.localSettings;
        localSettings.values[key] = obj;
    },

    getStorageJSON: function (key) {
        var applicationData = Windows.Storage.ApplicationData.current;
        var localSettings = applicationData.localSettings;
        return localSettings.values[key] ? JSON.parse(localSettings.values[key]) : undefined;
        
    },
    setStorageJSON: function (key, obj) {
        var applicationData = Windows.Storage.ApplicationData.current;
        var localSettings = applicationData.localSettings;
        localSettings.values[key] = JSON.stringify(obj);
    },

    setInfo: function (info) {
        var applicationData = Windows.Storage.ApplicationData.current; 
        var localFolder = applicationData.localFolder;
        
        localFolder.createFileAsync("info.txt", Windows.Storage.CreationCollisionOption.replaceExisting) 
        .then(function (file) { 
            return Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(info)); 
        })
    },
    getInfo: function (callback) {
        var applicationData = Windows.Storage.ApplicationData.current; 
        var localFolder = applicationData.localFolder; 

        localFolder.getFileAsync("info.txt").then(function getFileSuccess(file) {
            if (file.isAvailable)
                return Windows.Storage.FileIO.readTextAsync(file);
            else
                return "";
        }).done(function (info) {
            callback(JSON.parse(info))
        }, function () {
            callback(undefined);
        });
    },

    pushNotifications: function(events) {
        console.log(events)

        Zankyo.cancelNotifications();

        /*var test = { name: '「解き放たれし鋼鉄の威信」', time: Date.now() + 15 * 60 * 1000 + 1000 };
        pushToastNotification(test);
        var test2 = { name: '「解き放たれし鋼鉄の威信」', time: Date.now() + 60 * 60 * 1000 + 1000 };
        pushTileNotification(test2);*/
    
        for (var i in events) {
            if (events[i].time + 60*60*1000 > Date.now()) {
                Zankyo.pushToastNotification(events[i]);
                Zankyo.pushTileNotification(events[i]);           
            }   
        }
    },
    pushTileNotifications: function(events) {
        Zankyo.cancelNotifications();
        for (var i in events) {
            if (events[i].time > Date.now()) {
                Zankyo.pushTileNotification(events[i]);
            }
        }
    },

    pushToastNotification: function(event) {
        var Notifications = Windows.UI.Notifications;
        var currentTime = new Date();
        var dueTime = Date.now() > event.time - 15 * 60 * 1000 ? new Date(Date.now() + 500) : new Date(event.time - 15 * 60 * 1000);
        var idNumber = Math.floor(Math.random() * 100000000);  // Generates a unique ID number for the notification.

        // Set up the notification text.
        var toastXml = Notifications.ToastNotificationManager.getTemplateContent(Notifications.ToastTemplateType.toastText02);
        var strings = toastXml.getElementsByTagName("text");
        strings[0].appendChild(toastXml.createTextNode(event.name));
        strings[1].appendChild(toastXml.createTextNode("starts at: " + formatDate(event.time)));

        // Create the toast notification object.
        var toast = new Notifications.ScheduledToastNotification(toastXml, dueTime);
        toast.id = "Toast" + idNumber;

        // Add to the schedule.
        Notifications.ToastNotificationManager.createToastNotifier().addToSchedule(toast);

        //event.toastId = toast.id;

        //console.log('toast pushed:');
        //console.log(event);
        //console.log(toast);
    },

    pushTileNotification: function (event) {
        "use strict";

        var Notifications = Windows.UI.Notifications;
        var currentTime = new Date();
        var dueTime = Date.now() > event.time - 60 * 60 * 1000? new Date(Date.now()+500):new Date(event.time - 60 * 60 * 1000);
        var idNumber = Math.floor(Math.random() * 100000000);  // Generates a unique ID number for the notification.

        var tileXml = Notifications.TileUpdateManager.getTemplateContent(Notifications.TileTemplateType.tileWide310x150ImageAndText01);

   

        // Set up the wide tile text.
        var tileImgAttributes = tileXml.getElementsByTagName("image");
        var ImgAttrbutesNode = tileXml.createAttribute('src');
        ImgAttrbutesNode.value = 'ms-appx:///images/tile-wide.png';
        tileImgAttributes[0].attributes.setNamedItem(ImgAttrbutesNode);
        var tileTextAttributes = tileXml.getElementsByTagName("text");
        tileTextAttributes[0].appendChild(tileXml.createTextNode(event.name + ' ' + formatDate(event.time)));
        // tileTextAttributes[1].appendChild(tileXml.createTextNode("starts at: " + formatDate(event.time)));

        //console.log(tileXml);

        // Set up the medium tile text.
        var squareTileXml = Notifications.TileUpdateManager.getTemplateContent(Notifications.TileTemplateType.tileSquare150x150Text04);
        var squareTileTextAttributes = squareTileXml.getElementsByTagName("text");
        squareTileTextAttributes[0].appendChild(squareTileXml.createTextNode(event.name + "\n" + formatDate(event.time)));

        // Include the medium tile in the notification.
        var node = tileXml.importNode(squareTileXml.getElementsByTagName("binding").item(0), true);
        tileXml.getElementsByTagName("visual").item(0).appendChild(node);

        // Create the notification object.
        var futureTile = new Notifications.ScheduledTileNotification(tileXml, dueTime);
        futureTile.expirationTime = new Date( event.time + 60 * 60 * 1000);
        futureTile.id = "Tile" + idNumber;

        //console.log(futureTile);

        // Add to the schedule.
        Notifications.TileUpdateManager.createTileUpdaterForApplication().addToSchedule(futureTile);
    },

    cancelNotifications:function(){
        "use strict";
        var Notifications = Windows.UI.Notifications;
        var ToastNotifier = Notifications.ToastNotificationManager.createToastNotifier();
        var toastSchedules = ToastNotifier.getScheduledToastNotifications();
        for (var i = 0; i < toastSchedules.length; i++) {
            ToastNotifier.removeFromSchedule(toastSchedules.getAt(i));
        }

        var TileUpdater = Notifications.TileUpdateManager.createTileUpdaterForApplication()
        var tileSchedules = TileUpdater.getScheduledTileNotifications();
        for (var i = 0; i < tileSchedules.length; i++) {
            TileUpdater.removeFromSchedule(tileSchedules.getAt(i));
        }
    },

    pushRandomEventNotification: function(event){
        var Notifications = Windows.UI.Notifications;
        var currentTime = new Date();
        //var dueTime = Date.now() > event.time - 15 * 60 * 1000 ? new Date(Date.now() + 1000) : new Date(event.time - 15 * 60 * 1000);
        var dueTime = new Date(Date.now() + 500);
        var idNumber = Math.floor(Math.random() * 100000000);  // Generates a unique ID number for the notification.

        // Set up the notification text.
        var toastXml = Notifications.ToastNotificationManager.getTemplateContent(Notifications.ToastTemplateType.toastText02);
        var strings = toastXml.getElementsByTagName("text");

        var message;
        if (window.navigator.language == 'zh-CN')
            message = formatTime(event.time) + '的随机緊急：';
        else if (window.navigator.language == 'zh-TW' || window.navigator.language == 'zh-HK')
            message = formatTime(event.time) + '的随机緊急：';
        else if (window.navigator.language == 'ja-JP')
            message = formatTime(event.time) + 'のランダム緊急：';
        else
            message = 'Random quests at ' + formatTime(event.time)+':';


        strings[0].appendChild(toastXml.createTextNode(message));
        strings[1].appendChild(toastXml.createTextNode(event.name));

        // Create the toast notification object.
        var toast = new Notifications.ScheduledToastNotification(toastXml, dueTime);
        toast.id = "Toast" + idNumber;

        // Add to the schedule.
        Notifications.ToastNotificationManager.createToastNotifier().addToSchedule(toast);
    }
}

