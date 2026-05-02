namespace Threads.API.Dtos;

public class StoryDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    
    public string Content { get; set; } = "";
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }

    public UserDto User { get; set; } = null!;
    public List<HashtagDto> Hashtags { get; set; } = new();
    
    public int LikesCount { get; set; }
    public bool IsLiked { get; set; }
    public bool IsExpired { get; set; }
}
