// File: Entities/Like.cs

namespace Threads.API.Entities;

public class Like
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    // Thêm dấu ? để cho phép NULL trong Database
    public Guid? PostId { get; set; } 
    public Guid? StoryId { get; set; }

    // Navigation properties
    public User User { get; set; }
    public Post Post { get; set; }
    public Story Story { get; set; }
}