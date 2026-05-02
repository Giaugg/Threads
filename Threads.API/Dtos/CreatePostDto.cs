// File: Dtos/PostDto.cs

namespace Threads.API.Dtos;

public class CreatePostDto
{
    public Guid UserId { get; set; }
    public string Content { get; set; }
    public string? ImageUrl { get; set; }
}
