using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdminController : ControllerBase {
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    // ============================================
    // USER MANAGEMENT
    // ============================================

    // GET all users
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var users = await _context.Users
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.AvatarUrl,
                u.Bio,
                u.CreatedAt,
                PostsCount = u.Posts.Count,
                FollowersCount = u.Followers.Count,
                FollowingCount = u.Following.Count
            })
            .ToListAsync();

        return Ok(users);
    }

    // GET user by ID
    [HttpGet("users/{userId}")]
    public async Task<IActionResult> GetUserById(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.Posts)
            .Include(u => u.Followers)
            .Include(u => u.Following)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound("User not found");

        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email,
            user.AvatarUrl,
            user.Bio,
            user.CreatedAt,
            PostsCount = user.Posts.Count,
            FollowersCount = user.Followers.Count,
            FollowingCount = user.Following.Count
        });
    }

    // UPDATE user
    [HttpPut("users/{userId}")]
    public async Task<IActionResult> UpdateUser(Guid userId, [FromBody] UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("User not found");

        user.Username = dto.Username ?? user.Username;
        user.Bio = dto.Bio ?? user.Bio;
        user.AvatarUrl = dto.AvatarUrl ?? user.AvatarUrl;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User updated successfully", user });
    }

    // DELETE user
    [HttpDelete("users/{userId}")]
    public async Task<IActionResult> DeleteUser(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("User not found");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User deleted successfully" });
    }

    // ============================================
    // POST MANAGEMENT
    // ============================================

    // ============================================
    // USER SEARCH (CHO CREATE POST)
    // ============================================

    [HttpGet("users/search")]
    public async Task<IActionResult> SearchUsers([FromQuery] string keyword)
    {
        var users = await _context.Users
            .Where(u => u.Username.Contains(keyword))
            .Take(10)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.AvatarUrl
            })
            .ToListAsync();

        return Ok(users);
    }

    // ============================================
    // CREATE POST
    // ============================================

    [HttpPost("posts")]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
    {
        var user = await _context.Users.FindAsync(dto.UserId);
        if (user == null) return NotFound("User not found");

        var post = new Post
        {
            Id = Guid.NewGuid(),
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            UserId = dto.UserId,
            CreatedAt = DateTime.Now     

        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Post created", post });
    }


    // ============================================
    // DELETE POST
    // ============================================

    [HttpDelete("posts/{postId}")]
    public async Task<IActionResult> DeletePost(Guid postId)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post == null) return NotFound();

        // 1. Tìm và xóa tất cả Like liên quan trước
        var relatedLikes = _context.Likes.Where(l => l.PostId == postId);
        _context.Likes.RemoveRange(relatedLikes);

        // 2. Tìm và xóa tất cả Comment liên quan (nếu có)
        var relatedComments = _context.Comments.Where(c => c.PostId == postId);
        _context.Comments.RemoveRange(relatedComments);

        // 3. Cuối cùng mới xóa bài viết
        _context.Posts.Remove(post);

        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPut("posts/{postId}")]
    public async Task<IActionResult> UpdatePost(Guid postId, [FromBody] UpdatePostDto dto)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post == null) return NotFound("Post not found");

        post.Content = dto.Content ?? post.Content;
        post.ImageUrl = dto.ImageUrl ?? post.ImageUrl;

        _context.Posts.Update(post);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Post updated", post });
    }
    // ============================================
    // GET POSTS
    // ============================================

    [HttpGet("posts")]
    public async Task<IActionResult> GetAllPosts(int page = 1, int pageSize = 10)
    {
        var posts = await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.Id,
                p.Content,
                p.ImageUrl,
                p.CreatedAt,
                User = new { p.User.Id, p.User.Username },
                LikesCount = p.Likes.Count,
                CommentsCount = p.Comments.Count
            })
            .ToListAsync();

        return Ok(posts);
    }

    // ============================================
    // HASHTAG - UPDATE
    // ============================================

    [HttpPut("hashtags/{id}")]
    public async Task<IActionResult> UpdateHashtag(Guid id, [FromBody] HashtagDto dto)
    {
        var hashtag = await _context.Hashtags.FindAsync(id);
        if (hashtag == null) return NotFound();

        hashtag.Name = dto.Name.Replace("#", "");
        await _context.SaveChangesAsync();
        return Ok(hashtag);
    }

    // ============================================
    // HASHTAG - CREATE
    // ============================================

    [HttpPost("hashtags/{name}")] // Phải thêm {name} vào route
    public async Task<IActionResult> AddHashtag(string name) // Xóa [FromBody]
    {
        // Kiểm tra xem hashtag đã tồn tại chưa
        var existingHashtag = await _context.Hashtags.FirstOrDefaultAsync(h => h.Name.ToLower() == name.ToLower());
        if (existingHashtag != null)
        {
            return Ok(new HashtagDto
            {
                Id = existingHashtag.Id,
                Name = existingHashtag.Name,
                CreatedAt = existingHashtag.CreatedAt,
                PostCount = existingHashtag.PostHashtags.Count
            });
        }

        // Nếu chưa tồn tại, tạo hashtag mới
        var newHashtag = new Hashtag
        {
            Id = Guid.NewGuid(),
            Name = name,
            CreatedAt = DateTime.Now
        };

        _context.Hashtags.Add(newHashtag);
        await _context.SaveChangesAsync();

        return Ok(new HashtagDto
        {
            Id = newHashtag.Id,
            Name = newHashtag.Name,
            CreatedAt = newHashtag.CreatedAt,
            PostCount = 0
        });
    }
    // ============================================
    // REPOST - UPDATE
    // ============================================

    [HttpPut("reposts/{id}")]
    public async Task<IActionResult> UpdateRepost(Guid id, [FromBody] string caption)
    {
        var repost = await _context.Reposts.FindAsync(id);
        if (repost == null) return NotFound();

        repost.Caption = caption;
        await _context.SaveChangesAsync();

        return Ok(repost);
    }

    // ============================================
    // COMMENT - UPDATE
    // ============================================

    [HttpPut("comments/{id}")]
    public async Task<IActionResult> UpdateComment(Guid id, [FromBody] string content)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null) return NotFound();

        comment.Content = content;
        await _context.SaveChangesAsync();

        return Ok(comment);
    }

    // ============================================
    // STORY MANAGEMENT
    // ============================================

    // GET all stories
    [HttpGet("stories")]
    public async Task<IActionResult> GetAllStories([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var stories = await _context.Stories
            .Include(s => s.User)
            .Include(s => s.Likes)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new
            {
                s.Id,
                s.Content,
                s.ImageUrl,
                s.CreatedAt,
                s.ExpiresAt,
                User = new { s.User.Id, s.User.Username },
                LikesCount = s.Likes.Count,
                IsExpired = s.ExpiresAt <= DateTime.Now     

            })
            .ToListAsync();

        return Ok(stories);
    }

    // DELETE story
    [HttpDelete("stories/{storyId}")]
    public async Task<IActionResult> DeleteStory(Guid storyId)
    {
        var story = await _context.Stories.FindAsync(storyId);
        if (story == null) return NotFound("Story không tồn tại");

        // 1. Xóa tất cả các Like liên quan đến Story này
        var relatedLikes = _context.Likes.Where(l => l.StoryId == storyId);
        _context.Likes.RemoveRange(relatedLikes);

        // 2. Xóa Story chính
        _context.Stories.Remove(story);

        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa Story thành công" });
    }

    // ============================================
    // HASHTAG MANAGEMENT
    // ============================================

    // GET all hashtags
    [HttpGet("hashtags")]
    public async Task<IActionResult> GetAllHashtags([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var hashtags = await _context.Hashtags
            .Include(h => h.PostHashtags)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .OrderByDescending(h => h.PostHashtags.Count)
            .Select(h => new
            {
                h.Id,
                h.Name,
                h.CreatedAt,
                PostCount = h.PostHashtags.Count
            })
            .ToListAsync();

        return Ok(hashtags);
    }

    // DELETE hashtag
    [HttpDelete("hashtags/{hashtagId}")]
    public async Task<IActionResult> DeleteHashtag(Guid hashtagId)
    {
        var hashtag = await _context.Hashtags
            .Include(h => h.PostHashtags) // Load các liên kết giữa Hashtag và Post
            .FirstOrDefaultAsync(h => h.Id == hashtagId);

        if (hashtag == null) return NotFound("Hashtag không tồn tại");

        // 1. Xóa các bản ghi liên kết trong bảng trung gian trước để tránh lỗi FK
        if (hashtag.PostHashtags.Any())
        {
            _context.PostHashtags.RemoveRange(hashtag.PostHashtags);
        }

        // 2. Xóa Hashtag chính
        _context.Hashtags.Remove(hashtag);

        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã xóa Hashtag và các liên kết liên quan" });
    }

    // ============================================
    // REPOST MANAGEMENT
    // ============================================

    // GET all reposts
    [HttpGet("reposts")]
    public async Task<IActionResult> GetAllReposts([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var reposts = await _context.Reposts
            .Include(r => r.User)
            .Include(r => r.OriginalPost)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.Caption,
                r.CreatedAt,
                User = new { r.User.Id, r.User.Username },
                OriginalPost = new { r.OriginalPost.Id, r.OriginalPost.Content }
            })
            .ToListAsync();

        return Ok(reposts);
    }

    // DELETE repost
    [HttpDelete("reposts/{repostId}")]
    public async Task<IActionResult> DeleteRepost(Guid repostId)
    {
        var repost = await _context.Reposts.FindAsync(repostId);
        if (repost == null) return NotFound("Repost not found");

        _context.Reposts.Remove(repost);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Repost deleted successfully" });
    }

    // ============================================
    // STATISTICS
    // ============================================

    // GET dashboard statistics
    [HttpGet("statistics")]
    public async Task<IActionResult> GetStatistics()
    {
        var stats = new
        {
            TotalUsers = await _context.Users.CountAsync(),
            TotalPosts = await _context.Posts.CountAsync(),
            TotalStories = await _context.Stories.CountAsync(),
            TotalHashtags = await _context.Hashtags.CountAsync(),
            TotalReposts = await _context.Reposts.CountAsync(),
            TotalComments = await _context.Comments.CountAsync(),
            TotalLikes = await _context.Likes.CountAsync(),
            ActiveStories = await _context.Stories.CountAsync(s => s.ExpiresAt > DateTime.UtcNow),
            ExpiredStories = await _context.Stories.CountAsync(s => s.ExpiresAt <= DateTime.UtcNow)
        };

        return Ok(stats);
    }

    // ============================================
    // COMMENT MANAGEMENT
    // ============================================

    // GET all comments
    [HttpGet("comments")]
    public async Task<IActionResult> GetAllComments([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var comments = await _context.Comments
            .Include(c => c.User)
            .Include(c => c.Post)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.Content,
                c.CreatedAt,
                User = new { c.User.Id, c.User.Username },
                Post = new { c.Post.Id, c.Post.Content }
            })
            .ToListAsync();

        return Ok(comments);
    }

    // DELETE comment
    [HttpDelete("comments/{commentId}")]
    public async Task<IActionResult> DeleteComment(Guid commentId)
    {
        var comment = await _context.Comments.FindAsync(commentId);
        if (comment == null) return NotFound("Comment not found");

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Comment deleted successfully" });
    }
}
