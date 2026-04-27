// File: Entities/Notification.cs

namespace Threads.API.Entities;

public class Notification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public string Type { get; set; }
    public Guid? RefId { get; set; }

    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}