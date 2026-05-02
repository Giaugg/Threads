namespace Threads.API.Dtos;


public class UpdatePostDto
{
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
}

public class SearchUserDto
{
    public string Keyword { get; set; } = string.Empty;
}