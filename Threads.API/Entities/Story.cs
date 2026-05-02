// File: Entities/Story.cs

namespace Threads.API.Entities;

public class Story
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public string Content { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; } // Auto-hide after 24 hours

    public User User { get; set; }
    public ICollection<Like> Likes { get; set; }

    // Many-to-many relationship with Hashtags
    public ICollection<StoryHashtag> StoryHashtags { get; set; }
}
