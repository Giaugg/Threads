using Microsoft.AspNetCore.SignalR;
using Threads.API.Data;

public class NotificationService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<NotificationHub> _hub;

    public NotificationService(AppDbContext context, IHubContext<NotificationHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    public async Task SendAsync(Guid userId, string type, string message, Guid? fromUserId = null, Guid? postId = null)
    {
        var noti = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Type = type,
            Message = message,
            FromUserId = fromUserId,
            PostId = postId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(noti);
        await _context.SaveChangesAsync();

        // 🔥 realtime
        await _hub.Clients.Group(userId.ToString())
            .SendAsync("ReceiveNotification", new
            {
                id = noti.Id,
                message = noti.Message,
                type = noti.Type,
                postId = noti.PostId,
                createdAt = noti.CreatedAt
            });
    }
}