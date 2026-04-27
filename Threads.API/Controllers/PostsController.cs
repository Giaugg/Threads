// File: Controllers/PostsController.cs

using Microsoft.AspNetCore.Mvc;           // ✅ BẮT BUỘC
using Microsoft.EntityFrameworkCore;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PostsController(AppDbContext context)
    {
        _context = context;
    }

    // GET all posts
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var posts = await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(posts);
    }

    // CREATE post
    [HttpPost]
    public async Task<IActionResult> Create(CreatePostDto dto)
    {
        var post = new Post
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow
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
}