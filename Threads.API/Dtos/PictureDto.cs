namespace Threads.API.Dtos;

public class PictureDto
{
    public Guid Id { get; set; }
    public Guid PostId { get; set; }
    public string Url { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}
