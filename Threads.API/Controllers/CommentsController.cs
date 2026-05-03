// File: Controllers/CommentsController.cs

using Microsoft.AspNetCore.Mvc;           // ✅ BẮT BUỘC
using Microsoft.EntityFrameworkCore;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;
using System.Security.Claims;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly NotificationService _notificationService;

    public CommentsController(AppDbContext context, NotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCommentDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return Unauthorized();

        var userGuid = Guid.Parse(userId);

        // check user tồn tại (optional nhưng nên có)
        var userExists = await _context.Users.AnyAsync(x => x.Id == userGuid);
        if (!userExists)
            return BadRequest("User không tồn tại");

        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            Content = dto.Content,
            PostId = dto.PostId,
            ParentCommentId = dto.ParentCommentId,
            UserId = userGuid,
            CreatedAt = DateTime.Now     
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        // 🔔 Send notification to post author
        var post = await _context.Posts.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == dto.PostId);
        var commenter = await _context.Users.FindAsync(userGuid);

        if (post != null && post.UserId != userGuid && commenter != null)
        {
            await _notificationService.SendAsync(
                post.UserId,
                "comment",
                $"{commenter.Username} đã bình luận bài viết của bạn \"{dto.Content}\"",
                userGuid,
                dto.PostId,
                post.Content.Substring(0, Math.Min(50, post.Content.Length))
            );
        }

        return Ok(comment);
    }

    [HttpPost("reply")]
    public async Task<IActionResult> Reply(CreateCommentDto dto)
    {
        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            PostId = dto.PostId,
            Content = dto.Content,
            ParentCommentId = dto.ParentCommentId,
            CreatedAt = DateTime.Now     
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        // 🔔 Send notification to parent comment author
        if (dto.ParentCommentId.HasValue && dto.ParentCommentId != Guid.Empty)
        {
            var parentComment = await _context.Comments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == dto.ParentCommentId);

            var replier = await _context.Users.FindAsync(dto.UserId);
            
            if (parentComment != null && parentComment.UserId != dto.UserId && replier != null)
            {
                await _notificationService.SendAsync(
                    parentComment.UserId,
                    "comment",
                    $"{replier.Username} đã trả lời bình luận của bạn trên bài viết {parentComment.Post.Content.Substring(0, Math.Min(50, parentComment.Post.Content.Length))}",
                    dto.UserId,
                    dto.PostId,
                    parentComment.Post.Content.Substring(0, Math.Min(50, parentComment.Post.Content.Length))
                );
            }
        }

        var savedComment = await _context.Comments
            .Include(c => c.User)
            .FirstAsync(c => c.Id == comment.Id);

        return Ok(savedComment);
    }

    [HttpGet("post/{postId}")]
    public async Task<IActionResult> GetByPost(Guid postId)
    {
        var comments = await _context.Comments
            .Where(c => c.PostId == postId && c.ParentCommentId == null)
            .Include(c => c.User)
            .ToListAsync();

        return Ok(comments);
    }

    [HttpGet("{commentId}/replies")]
    public async Task<IActionResult> GetReplies(Guid commentId)
    {
        var replies = await _context.Comments
            .Where(c => c.ParentCommentId == commentId)
            .Include(c => c.User)
            .ToListAsync();

        return Ok(replies);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUser(Guid userId)
    {
        var comments = await _context.Comments
            .Where(c => c.UserId == userId)
            .Include(c => c.Post)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new {
                c.Id,
                c.Content,
                c.CreatedAt,
                Post = new {
                    c.Post.Id,
                    c.Post.Content
                }
            })
            .ToListAsync();

        return Ok(comments);
    }
}