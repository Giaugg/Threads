// File: Entities/Repost.cs

namespace Threads.API.Entities;

public class Repost
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid OriginalPostId { get; set; }

    public string? Caption { get; set; } // Optional caption when reposting
    public DateTime CreatedAt { get; set; }

    // Foreign keys
    public User User { get; set; }
    public Post OriginalPost { get; set; }
}
