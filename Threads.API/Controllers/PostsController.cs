// File: Controllers/PostsController.cs

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;           // ✅ BẮT BUỘC
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;
using System.Text.RegularExpressions;

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
    public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? userId = userIdClaim != null ? Guid.Parse(userIdClaim) : null;

        // 1. Tính tổng số bài viết
        var query = _context.Posts.AsQueryable();
        var totalCount = await query.CountAsync();

        // 2. Lấy dữ liệu phân trang
        var posts = await query
            .Include(p => p.User)
            .Include(p => p.PostHashtags).ThenInclude(ph => ph.Hashtag)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((pageNumber - 1) * pageSize) // Bỏ qua các trang trước
            .Take(pageSize)                   // Lấy số lượng của trang hiện tại
            .Select(p => new PostDto
            {
                Id = p.Id,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                CreatedAt = p.CreatedAt,
                User = new UserDto { 
                    Id = p.User.Id, Username = p.User.Username, 
                    AvatarUrl = p.User.AvatarUrl 
                },
                LikesCount = p.Likes.Count,
                IsLiked = userId.HasValue && p.Likes.Any(l => l.UserId == userId.Value),
                Hashtags = p.PostHashtags.Select(ph => ph.Hashtag.Name).ToList()
            })
            .ToListAsync();

        // 3. Trả về kết quả kèm thông tin phân trang
        return Ok(new PagedResult<PostDto>
        {
            Items = posts,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        });
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

        // 1. Tìm các hashtag trong Content (VD: "Hello #dotnet #csharp")
        var hashtagMatches = Regex.Matches(dto.Content, @"#\w+");
        
        if (hashtagMatches.Count > 0)
        {
            // Loại bỏ dấu # và chuyển về chữ thường để không trùng lặp (vd: #DotNet và #dotnet là 1)
            var hashtagNames = hashtagMatches
                .Select(m => m.Value.Replace("#", "").ToLower())
                .Distinct()
                .ToList();

            foreach (var name in hashtagNames)
            {
                // 2. Kiểm tra hashtag đã tồn tại trong DB chưa
                var hashtag = await _context.Hashtags
                    .FirstOrDefaultAsync(h => h.Name == name);

                // 3. Nếu chưa có thì tạo mới
                if (hashtag == null)
                {
                    hashtag = new Hashtag { Id = Guid.NewGuid(), Name = name };
                    _context.Hashtags.Add(hashtag);
                }

                // 4. Thêm vào bảng trung gian PostHashtag
                post.PostHashtags.Add(new PostHashtag
                {
                    PostId = post.Id,
                    Hashtag = hashtag
                });
            }
        }

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
            CreatedAt = DateTime.Now     
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