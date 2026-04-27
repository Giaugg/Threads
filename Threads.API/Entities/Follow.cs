// File: Entities/Follow.cs

namespace Threads.API.Entities;

public class Follow
{
    public Guid FollowerId { get; set; }
    public Guid FollowingId { get; set; }

    public User Follower { get; set; }
    public User Following { get; set; }
}