// File: Entities/StoryHashtag.cs

namespace Threads.API.Entities;

public class StoryHashtag
{
    public Guid StoryId { get; set; }
    public Guid HashtagId { get; set; }

    public Story Story { get; set; }
    public Hashtag Hashtag { get; set; }
}
