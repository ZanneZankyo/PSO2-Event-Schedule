/*(function () {
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
    
})*/

function OnBackgroundActivated()
{
    Zankyo.cancelRandomEventNotifications();
    FindRandomEventsTask(function () {
        backgroundTaskInstance.succeeded = true;
        close();
    });
}

function registerBackgroundTasks(taskName, time) {

    "use strict";

    var background = Windows.ApplicationModel.Background;

    var builder = new background.BackgroundTaskBuilder();

    builder.name = taskName;
    //builder.taskEntryPoint = "js\\backgroundtask.js";

    var timeTrigger = new background.TimeTrigger(15, false);
    builder.setTrigger(timeTrigger);

    var conditionType = background.SystemConditionType.internetAvailable;
    var taskCondition = new background.SystemCondition(conditionType);
    builder.addCondition(taskCondition);

    //background.BackgroundExecutionManager.removeAccess();

    background.BackgroundExecutionManager.requestAccessAsync().then(
    function (result) {
        switch (result) {
            case background.BackgroundAccessStatus.denied:
                // Background activity and updates for this app are disabled by the user. 
                break;

            case background.BackgroundAccessStatus.allowedWithAlwaysOnRealTimeConnectivity:
                // Added to list of background apps.
                // Set up background tasks; can use the network connectivity broker.
                var backgroundTaskRegistration = builder.register();
                break;

            case background.BackgroundAccessStatus.allowedMayUseActiveRealTimeConnectivity:
                // Added to list of background apps.
                // Set up background tasks; cannot use the network connectivity broker.
                var backgroundTaskRegistration = builder.register();
                break;

            case background.BackgroundAccessStatus.unspecified:
                // The user didn't explicitly disable or enable access and updates. 
                var backgroundTaskRegistration = builder.register();
                break;
        }
    });

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