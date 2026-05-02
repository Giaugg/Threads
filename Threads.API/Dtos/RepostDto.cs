namespace Threads.API.Dtos;

public class RepostDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid OriginalPostId { get; set; }
    
    public string? Caption { get; set; }
    public DateTime CreatedAt { get; set; }

    public UserDto User { get; set; } = null!;
    public PostDto OriginalPost { get; set; } = null!;
}
