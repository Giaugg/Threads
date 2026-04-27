// File: Controllers/LikesController.cs

using Microsoft.AspNetCore.Mvc;           // ✅ BẮT BUỘC
using Microsoft.EntityFrameworkCore;
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

    [HttpPost]
    public async Task<IActionResult> Like(Guid userId, Guid postId)
    {
        var like = new Like { UserId = userId, PostId = postId };

        _context.Likes.Add(like);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> Unlike(Guid userId, Guid postId)
    {
        var like = await _context.Likes.FindAsync(userId, postId);

        if (like == null) return NotFound();

        _context.Likes.Remove(like);
        await _context.SaveChangesAsync();

        return Ok();
    }
}