// File: Entities/User.cs

namespace Threads.API.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }

    public string AvatarUrl { get; set; }
    public string Bio { get; set; }

    public DateTime CreatedAt { get; set; }

    public ICollection<Post> Posts { get; set; }
    public ICollection<Like> Likes { get; set; }
    public ICollection<Comment> Comments { get; set; }

    public ICollection<Follow> Followers { get; set; }
    public ICollection<Follow> Following { get; set; }

    public ICollection<Notification> Notifications { get; set; }
    
    // Reposts relationship
    public ICollection<Repost> Reposts { get; set; }
    
    // Stories relationship
    public ICollection<Story> Stories { get; set; }
}