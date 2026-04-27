// File: Controllers/FeedController.cs

using Microsoft.AspNetCore.Mvc;           // ✅ BẮT BUỘC
using Microsoft.EntityFrameworkCore;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeedController : ControllerBase
{
    private readonly AppDbContext _context;

    public FeedController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetFeed(Guid userId)
    {
        var followingIds = await _context.Follows
            .Where(f => f.FollowerId == userId)
            .Select(f => f.FollowingId)
            .ToListAsync();

        var posts = await _context.Posts
            .Where(p => followingIds.Contains(p.UserId))
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(posts);
    }
}