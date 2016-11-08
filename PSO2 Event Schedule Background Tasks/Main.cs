using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.ApplicationModel.Background;
using System.Diagnostics;

namespace PBackgroundTasks
{
    public sealed class Main
    {
        public static void RegisterBackgroundTask(string taskName, uint time)
        {

            Debug.WriteLine("Register background task");

            var taskRegistered = false;

            foreach (var task in BackgroundTaskRegistration.AllTasks)
            {
                if (task.Value.Name == taskName)
                {
                    taskRegistered = true;
                    break;
                }
            }
            var builder = new BackgroundTaskBuilder();

            if (!taskRegistered)
            {
                builder.Name = taskName;
                builder.TaskEntryPoint = "PBackgroundTasks.PBackground";
                builder.SetTrigger(new TimeTrigger(time, false));
                var task = builder.Register();
            }
        }

        public static void CancelBackgroundTask(string taskName)
        {
            Debug.WriteLine("Cancel background task");

            foreach (var task in BackgroundTaskRegistration.AllTasks)
            {
                if (task.Value.Name == taskName)
                {
                    task.Value.Unregister(false);
                }
            }
        }
    }
}
