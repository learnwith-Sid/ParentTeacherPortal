using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ParentTeacherAPI.Hubs
{
    public class ChatHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userRole = Context.GetHttpContext()?.Request.Query["role"];
            Console.WriteLine($"🟢 User Connected: {Context.ConnectionId} | Role: {userRole}");

            if (!string.IsNullOrEmpty(userRole))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userRole);
                Console.WriteLine($"🔵 Added to Group: {userRole}");
            }

            await base.OnConnectedAsync();


        }
        public async Task SendMessage(string user, string message)
        {

            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendNotification(string message, string targetRole = "All")
        {
            Console.WriteLine("message-notify");
            await Clients.All.SendAsync("ReceiveNotification", message, targetRole);
        }
        public async Task SendTestNotification()
        {
            Console.WriteLine("📢 Sending Test Notification...");
            await Clients.All.SendAsync("ReceiveNotification", "🔔 This is a test notification!", "All");
        }

    }
}
