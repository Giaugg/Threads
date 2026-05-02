namespace Threads.API.Dtos;

public class PostDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = "";
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }

    public UserDto User { get; set; } = null!;

    public int LikesCount { get; set; }
    public bool IsLiked { get; set; }
    public List<string> Hashtags { get; set; } = new();
}
