// File: Controllers/FeedController.cs

using Microsoft.AspNetCore.Mvc;           // ✅ BẮT BUỘC
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
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
            .Where(p => _context.Follows
            .Where(f => f.FollowerId == userId)
            .Select(f => f.FollowingId)
            .Contains(p.UserId))
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostDto
            {
                Id = p.Id,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                CreatedAt = p.CreatedAt,
                User = new UserDto
                {
                    Id = p.User.Id,
                    Username = p.User.Username,
                    Email = p.User.Email,
                    AvatarUrl = p.User.AvatarUrl,
                    Bio = p.User.Bio
                },
                LikesCount = p.Likes.Count,
                IsLiked = p.Likes.Any(l => l.UserId == userId)
            })
            .ToListAsync();

                return Ok(posts);
            }

    [HttpGet("explore")]
    public async Task<IActionResult> Explore()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = userIdClaim != null ? Guid.Parse(userIdClaim) : null;

        var posts = await _context.Posts
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .Take(20)
            .Select(p => new PostDto
            {
                Id = p.Id,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                CreatedAt = p.CreatedAt,
                User = new UserDto
                {
                    Id = p.User.Id,
                    Username = p.User.Username,
                    Email = p.User.Email,
                    AvatarUrl = p.User.AvatarUrl,
                    Bio = p.User.Bio
                },
                LikesCount = p.Likes.Count,
                IsLiked = userId.HasValue && p.Likes.Any(l => l.UserId == userId.Value)
            })
            .ToListAsync();

        return Ok(posts);
    }


    [HttpGet("following/{userId}")]
    public async Task<IActionResult> FollowingFeed(Guid userId)
    {
        var followingIds = await _context.Follows
            .Where(f => f.FollowerId == userId)
            .Select(f => f.FollowingId)
            .ToListAsync();

        var posts = await _context.Posts
            .Where(p => followingIds.Contains(p.UserId))
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(posts);
    }
}