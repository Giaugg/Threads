using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // ================= GET ALL =================
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                AvatarUrl = u.AvatarUrl,
                Bio = u.Bio
            })
            .ToListAsync();

        return Ok(users);
    }

    // ================= SEARCH =================
    [HttpGet("search")]
    public async Task<IActionResult> SearchUsers(string? q)
    {
        if (string.IsNullOrWhiteSpace(q))
            return Ok(new List<UserDto>());

        var users = await _context.Users
            .Where(u => u.Username.Contains(q))
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                AvatarUrl = u.AvatarUrl,
                Bio = u.Bio
            })
            .ToListAsync();

        return Ok(users);
    }

    // ================= GET USER =================
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        return Ok(new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            Bio = user.Bio
        });
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUser(Guid userId)
    {
        var comments = await _context.Comments
            .Where(c => c.UserId == userId)
            .Include(c => c.Post)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.Content,
                c.CreatedAt,
                PostId = c.PostId
            })
            .ToListAsync();

        return Ok(comments);
    }

    [Authorize]
    [HttpGet("{id}/follow/check")]
    public async Task<IActionResult> CheckFollow(Guid id)
    {
        var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var isFollowing = await _context.Follows
            .AnyAsync(f => f.FollowerId == currentUserId && f.FollowingId == id);

        return Ok(new { isFollowing });
    }

    // ================= PROFILE =================
    [HttpGet("{id}/profile")]
    public async Task<IActionResult> GetProfile(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        var followers = await _context.Follows.CountAsync(f => f.FollowingId == id);
        var following = await _context.Follows.CountAsync(f => f.FollowerId == id);
        var posts = await _context.Posts.CountAsync(p => p.UserId == id);

        return Ok(new
        {
            user = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                AvatarUrl = user.AvatarUrl,
                Bio = user.Bio
            },
            followers,
            following,
            posts
        });
    }

    // ================= USER MEDIA =================
    [HttpGet("user/{userId}/media")]
    public async Task<IActionResult> GetUserMedia(Guid userId)
    {
        var posts = await _context.Posts
            .Where(p => p.UserId == userId && p.ImageUrl != null)
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
                    AvatarUrl = p.User.AvatarUrl
                }
            })
            .ToListAsync();

        return Ok(posts);
    }

    // ================= USER REPOSTS =================
    [HttpGet("user/{userId}/reposts")]
    public async Task<IActionResult> GetUserReposts(Guid userId)
    {
        var reposts = await _context.Posts
            .Where(p => p.RepostUserId == userId) // 👈 cần field này trong DB
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
                    AvatarUrl = p.User.AvatarUrl
                }
            })
            .ToListAsync();

        return Ok(reposts);
    }

    // ================= USER POSTS =================
    [HttpGet("{id}/posts")]
    public async Task<IActionResult> GetUserPosts(Guid id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? currentUserId = userIdClaim != null ? Guid.Parse(userIdClaim) : null;

        var posts = await _context.Posts
            .Where(p => p.UserId == id)
            .Include(p => p.User)
            .Include(p => p.Likes)
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
                IsLiked = currentUserId.HasValue &&
                          p.Likes.Any(l => l.UserId == currentUserId.Value)
            })
            .ToListAsync();

        return Ok(posts);
    }

    // ================= UPDATE =================
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateUserDto dto)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (currentUserId != id.ToString())
            return Forbid();

        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.Username = dto.Username ?? user.Username;
        user.Bio = dto.Bio ?? user.Bio;
        user.AvatarUrl = dto.AvatarUrl ?? user.AvatarUrl;

        await _context.SaveChangesAsync();

        return Ok(new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            Bio = user.Bio
        });
    }

    // ================= DELETE =================
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (currentUserId != id.ToString())
            return Forbid();

        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok();
    }

    // ================= FOLLOW =================
    [Authorize]
    [HttpPost("{id}/follow")]
    public async Task<IActionResult> Follow(Guid id)
    {
        var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (currentUserId == id)
            return BadRequest("Cannot follow yourself");

        var exists = await _context.Follows
            .AnyAsync(f => f.FollowerId == currentUserId && f.FollowingId == id);

        if (exists) return BadRequest("Already followed");

        var follow = new Follow
        {
            FollowerId = currentUserId,
            FollowingId = id
        };

        _context.Follows.Add(follow);
        await _context.SaveChangesAsync();

        return Ok();
    }

    // ================= UNFOLLOW =================
    [Authorize]
    [HttpDelete("{id}/follow")]
    public async Task<IActionResult> Unfollow(Guid id)
    {
        var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var follow = await _context.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == currentUserId && f.FollowingId == id);

        if (follow == null) return NotFound();

        _context.Follows.Remove(follow);
        await _context.SaveChangesAsync();

        return Ok();
    }

    // GET: api/users/top-followed?take=10
    [HttpGet("top-followed")]
    public async Task<IActionResult> GetTopFollowed(int take = 10)
    {
        var users = await _context.Users
            .Select(u => new
            {
                user = new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    AvatarUrl = u.AvatarUrl,
                    Bio = u.Bio
                },
                followers = _context.Follows.Count(f => f.FollowingId == u.Id)
            })
            .OrderByDescending(x => x.followers)
            .Take(take)
            .ToListAsync();

        return Ok(users);
    }
}