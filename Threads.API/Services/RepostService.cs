using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Threads.API.Services;

public class RepostService
{
    private readonly AppDbContext _context;

    public RepostService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Repost> CreateRepost(Guid userId, CreateRepostDto dto)
    {
        // 🔥 check post tồn tại
        var post = await _context.Posts.FindAsync(dto.OriginalPostId);
        if (post == null)
            throw new KeyNotFoundException("Post not found");

        // 🔥 check user tồn tại (optional nhưng nên có)
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new KeyNotFoundException("User not found");

        // 🔥 check đã repost chưa (tránh duplicate)
        var existed = await _context.Reposts
            .FirstOrDefaultAsync(r =>
                r.UserId == userId &&
                r.OriginalPostId == dto.OriginalPostId);

        if (existed != null)
            return existed; // hoặc throw

        var repost = new Repost
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            OriginalPostId = dto.OriginalPostId,
            Caption = dto.Caption,
            CreatedAt = DateTime.Now     
        };

        _context.Reposts.Add(repost);
        await _context.SaveChangesAsync();

        return repost;
    }

    public async Task<List<RepostDto>> GetUserReposts(Guid userId)
    {
        return await _context.Reposts
            .Where(r => r.UserId == userId)
            .Include(r => r.User)
            .Include(r => r.OriginalPost)
            .ThenInclude(p => p.User)
            .Include(r => r.OriginalPost)
            .ThenInclude(p => p.Likes)
            .Select(r => new RepostDto
            {
                Id = r.Id,
                UserId = r.UserId,
                OriginalPostId = r.OriginalPostId,
                Caption = r.Caption,
                CreatedAt = r.CreatedAt,
                User = new UserDto
                {
                    Id = r.User.Id,
                    Username = r.User.Username,
                    AvatarUrl = r.User.AvatarUrl
                },
                OriginalPost = new PostDto
                {
                    Id = r.OriginalPost.Id,
                    Content = r.OriginalPost.Content,
                    ImageUrl = r.OriginalPost.ImageUrl,
                    CreatedAt = r.OriginalPost.CreatedAt,
                    User = new UserDto
                    {
                        Id = r.OriginalPost.User.Id,
                        Username = r.OriginalPost.User.Username,
                        AvatarUrl = r.OriginalPost.User.AvatarUrl
                    },
                    LikesCount = r.OriginalPost.Likes.Count,
                    IsLiked = false
                }
            })
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<RepostDto>> GetPostReposts(Guid postId)
    {
        return await _context.Reposts
            .Where(r => r.OriginalPostId == postId)
            .Include(r => r.User)
            .Include(r => r.OriginalPost)
            .ThenInclude(p => p.User)
            .Include(r => r.OriginalPost)
            .ThenInclude(p => p.Likes)
            .Select(r => new RepostDto
            {
                Id = r.Id,
                UserId = r.UserId,
                OriginalPostId = r.OriginalPostId,
                Caption = r.Caption,
                CreatedAt = r.CreatedAt,
                User = new UserDto
                {
                    Id = r.User.Id,
                    Username = r.User.Username,
                    AvatarUrl = r.User.AvatarUrl
                },
                OriginalPost = new PostDto
                {
                    Id = r.OriginalPost.Id,
                    Content = r.OriginalPost.Content,
                    ImageUrl = r.OriginalPost.ImageUrl,
                    CreatedAt = r.OriginalPost.CreatedAt,
                    User = new UserDto
                    {
                        Id = r.OriginalPost.User.Id,
                        Username = r.OriginalPost.User.Username,
                        AvatarUrl = r.OriginalPost.User.AvatarUrl
                    },
                    LikesCount = r.OriginalPost.Likes.Count,
                    IsLiked = false
                }
            })
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task DeleteRepost(Guid repostId)
    {
        var repost = await _context.Reposts.FindAsync(repostId);
        if (repost == null) throw new KeyNotFoundException("Repost not found");

        _context.Reposts.Remove(repost);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsPostReposted(Guid postId, Guid userId)
    {
        return await _context.Reposts
            .AnyAsync(r => r.OriginalPostId == postId && r.UserId == userId);
    }
}
