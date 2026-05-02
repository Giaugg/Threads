// File: Entities/Post.cs

namespace Threads.API.Entities;

public class Post
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public string Content { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }

    public User User { get; set; }

    public ICollection<Like> Likes { get; set; }
    public ICollection<Comment> Comments { get; set; }
    
    // Pictures relationship
    public ICollection<Picture> Pictures { get; set; }

    // Hashtags many-to-many relationship
    public ICollection<PostHashtag> PostHashtags { get; set; }

    // Repost relationship
    public ICollection<Repost> Reposts { get; set; }

    public Guid? OriginalPostId { get; set; }
    public Post? OriginalPost { get; set; }
    public Guid? RepostUserId { get; set; }
}
