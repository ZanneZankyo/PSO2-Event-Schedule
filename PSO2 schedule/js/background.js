function buildBackgroundTasks(taskName, time) {
    
    /*"use strict";
    PBackgroundTasks.Main.registerBackgroundTask(taskName, time);
    //PBackgroundTasks.Main.RegisterBackgroundTask(taskName, time);
    /*
    var bg = Windows.ApplicationModel.Background;

    var taskRegistered = false;

    var allTasks = bg.BackgroundTaskRegistration.allTasks;

    console.log(allTasks.first());
    while (allTasks.size > 0) {
        var task = allTasks.first();
        if (task.current.value.name == taskName) {
            taskRegistered = true;
            break;
        }
        allTasks = allTasks.split(1);
    }

    if (!taskRegistered)
    {
        var taskBuilder = new bg.BackgroundTaskBuilder();
        var trigger = new bg.TimeTrigger(time, false);
        taskBuilder.setTrigger(trigger);
        // Must match class name and registration in the manifest
        taskBuilder.taskEntryPoint = "PBackgroundTasks.PBackground";
        taskBuilder.name = taskName;
        taskBuilder.register();
        console.log('background tasks registered');
    } */ 
}

function cancelBackgroundTasks(taskName) {
    /*"use strict";

    PBackgroundTasks.Main.cancelBackgroundTask(taskName);


    /*
    var bg = Windows.ApplicationModel.Background;
    /*var allTasks = bg.BackgroundTaskRegistration.allTasks;
    console.log(allTasks);
    for (var i in allTasks) {
        if (allTasks[i].Value.Name == taskName) {
            allTasks[i].Value.Unregister(true)
        }
    }*/
}