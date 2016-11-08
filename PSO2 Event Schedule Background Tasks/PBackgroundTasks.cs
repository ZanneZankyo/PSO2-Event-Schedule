using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Windows.ApplicationModel.Background;

namespace PBackgroundTasks
{
    public sealed class PBackgroundTask : IBackgroundTask
    {

        BackgroundTaskDeferral _deferral;
        public void Run(IBackgroundTaskInstance taskInstance)
        {
            Debug.WriteLine("Run background task");
            _deferral = taskInstance.GetDeferral();
            //await FindRamdon();
            FindRamdon();
            _deferral.Complete();
        }

        private void FindRamdon()
        {

            PushRamdonEvent();
            //return ;
        }
        private void PushRamdonEvent()
        {
            var currentTime = DateTime.Now;
            var dueTime = DateTime.Now.Add(new TimeSpan(0,0,1));// > event.time - 15 * 60 * 1000 ? new Date(Date.now() + 1000) : new Date(event.time - 15 * 60 * 1000);           
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