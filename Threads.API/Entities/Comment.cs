// File: Entities/Comment.cs

namespace Threads.API.Entities;

public class Comment
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public Guid PostId { get; set; }

    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }

    public User User { get; set; }
    public Post Post { get; set; }

    public Guid? ParentCommentId { get; set; }
    public Comment? ParentComment { get; set; }
}