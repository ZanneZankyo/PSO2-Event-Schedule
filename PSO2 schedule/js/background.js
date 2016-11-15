(function () {
    console.log("Background Task Run");
    "use strict";
    importScripts("../WinJS/js/base.js");
    importScripts("./windows-function.js");
    importScripts("./schedule.js");
    importScripts("./random.js");
    //Begin task
    

    var backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;

    var notifications = Windows.UI.Notifications;

    var date = new Date();
    Zankyo.cancelRandomEventNotifications();
    FindRandomEventsTask(function () {
        backgroundTaskInstance.succeeded = true;
        close();
    });
})

function registerBackgroundTasks(taskName, time) {

    "use strict";
    var builder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();
    builder.name = taskName;
    builder.taskEntryPoint = "js\\backgroundtask.js";
    var timeTrigger = new Windows.ApplicationModel.Background.TimeTrigger(15, false);
    //var timeTrigger = new Windows.ApplicationModel.Background.SystemTrigger(Windows.ApplicationModel.Background.SystemTriggerType.timeZoneChange, false);
    builder.setTrigger(timeTrigger);
    var conditionType = Windows.ApplicationModel.Background.SystemConditionType.internetAvailable;
    var taskCondition = new Windows.ApplicationModel.Background.SystemCondition(conditionType);
    builder.addCondition(taskCondition);
    var backgroundTaskRegistration = builder.register();
    console.log('background tasks registered');
    console.log(Windows.ApplicationModel.Background.BackgroundTaskRegistration.allTasks);
}

function cancelAllBackGroundTasks() {
    "use strict";

    importScripts("../WinJS/js/base.js");

    var bg = Windows.ApplicationModel.Background;
    var allTasks = bg.BackgroundTaskRegistration.allTasks;
    console.log(allTasks);
    for (var i in allTasks) {
        allTasks[i].Value.Unregister(true);
    }
}

function cancelBackgroundTasks(taskName) {
    "use strict";

    var bg = Windows.ApplicationModel.Background;
    var allTasks = bg.BackgroundTaskRegistration.allTasks;
    console.log(allTasks);
    for (var i in allTasks) {
        if (allTasks[i].Value.Name == taskName) {
            allTasks[i].Value.Unregister(true)
        }
    }
}