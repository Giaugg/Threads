// File: Entities/Hashtag.cs

namespace Threads.API.Entities;

public class Hashtag
{
    public Guid Id { get; set; }
    public string Name { get; set; } // e.g., "technology", "travel"
    public DateTime CreatedAt { get; set; }

    // Many-to-many relationship with Posts
    public ICollection<PostHashtag> PostHashtags { get; set; }

    // Many-to-many relationship with Stories
    public ICollection<StoryHashtag> StoryHashtags { get; set; }
}
