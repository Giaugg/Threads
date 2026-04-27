// File: Entities/Like.cs

namespace Threads.API.Entities;

public class Like
{
    public Guid UserId { get; set; }
    public Guid PostId { get; set; }

    public User User { get; set; }
    public Post Post { get; set; }
}