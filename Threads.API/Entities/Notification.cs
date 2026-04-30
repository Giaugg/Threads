public class Notification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; } // người nhận

    public string Type { get; set; } = ""; 
    // follow | like | comment | repost

    public string Message { get; set; } = "";

    public Guid? FromUserId { get; set; }
    public Guid? PostId { get; set; }

    public bool IsRead { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}