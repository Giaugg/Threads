namespace Threads.API.Dtos;

public class CreateRepostDto
{
    public Guid OriginalPostId { get; set; }
    public string? Caption { get; set; }
}
