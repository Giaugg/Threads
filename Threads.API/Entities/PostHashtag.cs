// File: Entities/PostHashtag.cs

namespace Threads.API.Entities;

public class PostHashtag
{
    public Guid PostId { get; set; }
    public Guid HashtagId { get; set; }

    public Post Post { get; set; }
    public Hashtag Hashtag { get; set; }
}
