// File: Controllers/PostsController.cs

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;           // ✅ BẮT BUỘC
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly NotificationService _notificationService;

    public PostsController(AppDbContext context, NotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    // GET all posts
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = userIdClaim != null ? Guid.Parse(userIdClaim) : null;

        var posts = await _context.Posts
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
                IsLiked = userId.HasValue && p.Likes.Any(l => l.UserId == userId.Value)
            })
            .ToListAsync();

        return Ok(posts);
    }

    // SEARCH POST
    [HttpGet("search")]
    public async Task<IActionResult> SearchPosts(string q)
    {
        var posts = await _context.Posts
            .Where(p => p.Content.Contains(q))
            .ToListAsync();

        return Ok(posts);
    }

    // CREATE post
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreatePostDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var post = new Post
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            CreatedAt = DateTime.UtcNow.AddHours(7)
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        return Ok(post);
    }

    // DELETE post
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return NotFound();

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("{id}/repost")]
    public async Task<IActionResult> Repost(Guid id, Guid userId)
    {
        var repost = new Post
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            OriginalPostId = id,
            Content = "",
            CreatedAt = DateTime.UtcNow
        };

        _context.Posts.Add(repost);
        await _context.SaveChangesAsync();

        // 🔔 Send notification to original post author
        var originalPost = await _context.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == id);
        
        var reposter = await _context.Users.FindAsync(userId);

        if (originalPost != null && originalPost.UserId != userId && reposter != null)
        {
            await _notificationService.SendAsync(
                originalPost.UserId,
                "repost",
                $"{reposter.Username} đã chia sẻ bài viết của bạn",
                userId,
                id
            );
        }

        return Ok(repost);
    }
}