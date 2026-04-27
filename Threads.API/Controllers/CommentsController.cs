// File: Controllers/CommentsController.cs

using Microsoft.AspNetCore.Mvc;           // ✅ BẮT BUỘC
using Microsoft.EntityFrameworkCore;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;
  
namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CommentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCommentDto dto)
    {
        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            PostId = dto.PostId,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return Ok(comment);
    }
}