using Microsoft.AspNetCore.SignalR;

namespace Threads.API.Hubs // ✅ THÊM DÒNG NÀY
{
    public class NotificationHub : Hub
    {
        public async Task JoinUserGroup(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }
    }
}