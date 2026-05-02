namespace Threads.API.Dtos;

public class CreateStoryDto
{
    public string Content { get; set; } = "";
    public string? ImageUrl { get; set; }
    public List<string> Hashtags { get; set; } = new();
}
