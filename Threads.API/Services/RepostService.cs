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

    public async Task<RepostDto> CreateRepost(Guid userId, CreateRepostDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new KeyNotFoundException("User not found");

        var originalPost = await _context.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == dto.OriginalPostId);
        if (originalPost == null) throw new KeyNotFoundException("Original post not found");

        var repost = new Repost
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            OriginalPostId = dto.OriginalPostId,
            Caption = dto.Caption,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reposts.Add(repost);
        await _context.SaveChangesAsync();

        return new RepostDto
        {
            Id = repost.Id,
            UserId = repost.UserId,
            OriginalPostId = repost.OriginalPostId,
            Caption = repost.Caption,
            CreatedAt = repost.CreatedAt,
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                AvatarUrl = user.AvatarUrl
            },
            OriginalPost = new PostDto
            {
                Id = originalPost.Id,
                Content = originalPost.Content,
                ImageUrl = originalPost.ImageUrl,
                CreatedAt = originalPost.CreatedAt,
                User = new UserDto
                {
                    Id = originalPost.User.Id,
                    Username = originalPost.User.Username,
                    AvatarUrl = originalPost.User.AvatarUrl
                },
                LikesCount = originalPost.Likes.Count,
                IsLiked = false
            }
        };
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
