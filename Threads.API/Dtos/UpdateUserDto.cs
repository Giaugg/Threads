using System.ComponentModel.DataAnnotations;

namespace Threads.API.Dtos;

public class UpdateUserDto
{
    [MinLength(3)]
    [MaxLength(50)]
    public string? Username { get; set; }

    [MaxLength(160)]
    public string? Bio { get; set; }

    [Url]
    public string? AvatarUrl { get; set; }
}