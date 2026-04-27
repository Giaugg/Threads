// File: Dtos/CommentDto.cs

namespace Threads.API.Dtos;

public class CreateCommentDto
{
    public Guid UserId { get; set; }
    public Guid PostId { get; set; }
    public string Content { get; set; }
}