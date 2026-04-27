// File: Dtos/UserDto.cs

namespace Threads.API.Dtos;

public class UpdateUserDto
{
    public string Username { get; set; }
    public string Bio { get; set; }
    public string AvatarUrl { get; set; }
}