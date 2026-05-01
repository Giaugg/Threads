// File: Controllers/FollowsController.cs

using Microsoft.AspNetCore.Mvc;           // ✅ BẮT BUỘC
using Microsoft.EntityFrameworkCore;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FollowsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly NotificationService _notificationService;

    public FollowsController(AppDbContext context, NotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    [HttpPost]
    public async Task<IActionResult> Follow(Guid followerId, Guid followingId)
    {
        var follow = new Follow
        {
            FollowerId = followerId,
            FollowingId = followingId
        };

        _context.Follows.Add(follow);
        await _context.SaveChangesAsync();

        // 🔔 Send notification to the followed user
        var follower = await _context.Users.FindAsync(followerId);
        if (follower != null)
        {
            await _notificationService.SendAsync(
                followingId,
                "follow",
                $"{follower.Username} đã theo dõi bạn",
                followerId
            );
        }

        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> Unfollow(Guid followerId, Guid followingId)
    {
        var follow = await _context.Follows.FindAsync(followerId, followingId);

        if (follow == null) return NotFound();

        _context.Follows.Remove(follow);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("check")]
    public async Task<IActionResult> CheckFollow(Guid followerId, Guid followingId)
    {
        var isFollow = await _context.Follows
            .AnyAsync(f => f.FollowerId == followerId && f.FollowingId == followingId);

        return Ok(isFollow);
    }
}