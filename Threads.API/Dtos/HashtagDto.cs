namespace Threads.API.Dtos;

public class HashtagDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public int PostCount { get; set; }
}
