using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Windows.ApplicationModel.Background;

namespace ZankyoBackgroundTasks
{
    public sealed class ZBackgroundTask : IBackgroundTask
    {

        BackgroundTaskDeferral _deferral;
        public async void Run(IBackgroundTaskInstance taskInstance)
        {
            Debug.WriteLine("Registering successfully.");
            _deferral = taskInstance.GetDeferral();

            var taskRegistered = false;
            var TaskName = "findRandomEvents";

            foreach (var task in BackgroundTaskRegistration.AllTasks)
            {
                if (task.Value.Name == TaskName)
                {
                    taskRegistered = true;
                    break;
                }
            }

            if (!taskRegistered)
            {

                TimeTrigger hourlyTrigger = new TimeTrigger(15, false);
                SystemCondition userCondition = new SystemCondition(SystemConditionType.UserPresent);

                await BackgroundExecutionManager.RequestAccessAsync();

                var builder = new BackgroundTaskBuilder();

                builder.Name = TaskName;
                builder.TaskEntryPoint = "ZankyoBackgroundTasks.ZBackground";
                builder.SetTrigger(hourlyTrigger);
                builder.Register();
            }

            await FindRamdon();
            Debug.WriteLine("Task registered successfully.");
            _deferral.Complete();
        }

        private Task FindRamdon()
        {

            PushRamdonEvent();
            return null;
        }
        private void PushRamdonEvent()
        {
            var currentTime = DateTime.Now;
            var dueTime = DateTime.Now;// > event.time - 15 * 60 * 1000 ? new Date(Date.now() + 1000) : new Date(event.time - 15 * 60 * 1000);           
            var idNumber = Math.Floor((double)new Random().Next());  // Generates a unique ID number for the notification.

            // Set up the notification text.

            var toastXml = Windows.UI.Notifications.ToastNotificationManager.GetTemplateContent(Windows.UI.Notifications.ToastTemplateType.ToastText02);
            var strings = toastXml.GetElementsByTagName("text");
            strings[0].AppendChild(toastXml.CreateTextNode("Random quests"));
            strings[1].AppendChild(toastXml.CreateTextNode(DateTime.Now.ToString()));

            // Create the toast notification object.
            var toast = new Windows.UI.Notifications.ScheduledToastNotification(toastXml, dueTime);
            toast.Id = "Toast" + idNumber;

            // Add to the schedule.
            Windows.UI.Notifications.ToastNotificationManager.CreateToastNotifier().AddToSchedule(toast);
        }
    }
}