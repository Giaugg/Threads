// File: Controllers/LikesController.cs

using Microsoft.AspNetCore.Mvc;           // ✅ BẮT BUỘC
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LikesController : ControllerBase
{
    private readonly AppDbContext _context;

    public LikesController(AppDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpPost("{postId}")]
    public async Task<IActionResult> Like(Guid postId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var existingLike = await _context.Likes.FindAsync(userId, postId);
        if (existingLike != null) return BadRequest("Already liked");

        var like = new Like { UserId = userId, PostId = postId };

        _context.Likes.Add(like);
        await _context.SaveChangesAsync();

        var likesCount = await _context.Likes.CountAsync(l => l.PostId == postId);

        return Ok(new { liked = true, likesCount });
    }

    [Authorize]
    [HttpDelete("{postId}")]
    public async Task<IActionResult> Unlike(Guid postId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var like = await _context.Likes.FindAsync(userId, postId);

        if (like == null) return NotFound();

        _context.Likes.Remove(like);
        await _context.SaveChangesAsync();

        var likesCount = await _context.Likes.CountAsync(l => l.PostId == postId);

        return Ok(new { liked = false, likesCount });
    }

    [Authorize]
    [HttpGet("{postId}/check")]
    public async Task<IActionResult> CheckLike(Guid postId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var liked = await _context.Likes
            .AnyAsync(l => l.UserId == userId && l.PostId == postId);

        return Ok(liked);
    }

    [HttpGet("post/{postId}")]
    public async Task<IActionResult> GetLikes(Guid postId)
    {
        var likes = await _context.Likes
            .Where(l => l.PostId == postId)
            .ToListAsync();

        return Ok(likes);
    }
}