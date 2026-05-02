using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Threads.API.Services;

public class StoryService
{
    private readonly AppDbContext _context;

    public StoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<StoryDto> CreateStory(Guid userId, CreateStoryDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new KeyNotFoundException("User not found");

        var story = new Story
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            CreatedAt = DateTime.UtcNow.AddHours(7), // Auto-hide after 24h,
            ExpiresAt = DateTime.UtcNow.AddHours(31) // Auto-hide after 24h
        };

        _context.Stories.Add(story);
        await _context.SaveChangesAsync();

        // Add hashtags
        if (dto.Hashtags.Any())
        {
            await AddHashtagsToStory(story.Id, dto.Hashtags);
        }

        return new StoryDto
        {
            Id = story.Id,
            UserId = story.UserId,
            Content = story.Content,
            ImageUrl = story.ImageUrl,
            CreatedAt = story.CreatedAt,
            ExpiresAt = story.ExpiresAt,
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                AvatarUrl = user.AvatarUrl
            },
            Hashtags = new(),
            LikesCount = 0,
            IsLiked = false,
            IsExpired = false
        };
    }

    public async Task<List<StoryDto>> GetActiveStoriesByUser(Guid userId)
    {
        var stories = await _context.Stories
            .Where(s => s.UserId == userId && s.ExpiresAt > DateTime.UtcNow)
            .Include(s => s.User)
            .Include(s => s.Likes)
            .Include(s => s.StoryHashtags)
            .ThenInclude(sh => sh.Hashtag)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new StoryDto
            {
                Id = s.Id,
                UserId = s.UserId,
                Content = s.Content,
                ImageUrl = s.ImageUrl,
                CreatedAt = s.CreatedAt,
                ExpiresAt = s.ExpiresAt,
                User = new UserDto
                {
                    Id = s.User.Id,
                    Username = s.User.Username,
                    AvatarUrl = s.User.AvatarUrl
                },
                Hashtags = s.StoryHashtags.Select(sh => new HashtagDto
                {
                    Id = sh.Hashtag.Id,
                    Name = sh.Hashtag.Name,
                    CreatedAt = sh.Hashtag.CreatedAt,
                    PostCount = 0
                }).ToList(),
                LikesCount = s.Likes.Count,
                IsLiked = false,
                IsExpired = s.ExpiresAt <= DateTime.UtcNow
            })
            .ToListAsync();

        return stories;
    }

    public async Task<List<StoryDto>> GetFollowingStories(Guid userId)
    {
        var followingIds = await _context.Follows
            .Where(f => f.FollowerId == userId)
            .Select(f => f.FollowingId)
            .ToListAsync();

        var stories = await _context.Stories
            .Where(s => followingIds.Contains(s.UserId) && s.ExpiresAt > DateTime.UtcNow)
            .Include(s => s.User)
            .Include(s => s.Likes)
            .Include(s => s.StoryHashtags)
            .ThenInclude(sh => sh.Hashtag)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new StoryDto
            {
                Id = s.Id,
                UserId = s.UserId,
                Content = s.Content,
                ImageUrl = s.ImageUrl,
                CreatedAt = s.CreatedAt,
                ExpiresAt = s.ExpiresAt,
                User = new UserDto
                {
                    Id = s.User.Id,
                    Username = s.User.Username,
                    AvatarUrl = s.User.AvatarUrl
                },
                Hashtags = s.StoryHashtags.Select(sh => new HashtagDto
                {
                    Id = sh.Hashtag.Id,
                    Name = sh.Hashtag.Name,
                    CreatedAt = sh.Hashtag.CreatedAt,
                    PostCount = 0
                }).ToList(),
                LikesCount = s.Likes.Count,
                IsLiked = false,
                IsExpired = s.ExpiresAt <= DateTime.UtcNow
            })
            .ToListAsync();

        return stories;
    }

    public async Task<StoryDto?> GetStoryById(Guid storyId)
    {
        var story = await _context.Stories
            .Where(s => s.Id == storyId && s.ExpiresAt > DateTime.UtcNow)
            .Include(s => s.User)
            .Include(s => s.Likes)
            .Include(s => s.StoryHashtags)
            .ThenInclude(sh => sh.Hashtag)
            .FirstOrDefaultAsync();

        if (story == null) return null;

        return new StoryDto
        {
            Id = story.Id,
            UserId = story.UserId,
            Content = story.Content,
            ImageUrl = story.ImageUrl,
            CreatedAt = story.CreatedAt,
            ExpiresAt = story.ExpiresAt,
            User = new UserDto
            {
                Id = story.User.Id,
                Username = story.User.Username,
                AvatarUrl = story.User.AvatarUrl
            },
            Hashtags = story.StoryHashtags.Select(sh => new HashtagDto
            {
                Id = sh.Hashtag.Id,
                Name = sh.Hashtag.Name,
                CreatedAt = sh.Hashtag.CreatedAt,
                PostCount = 0
            }).ToList(),
            LikesCount = story.Likes.Count,
            IsLiked = false,
            IsExpired = story.ExpiresAt <= DateTime.UtcNow
        };
    }

    public async Task DeleteStory(Guid storyId)
    {
        var story = await _context.Stories.FindAsync(storyId);
        if (story == null) throw new KeyNotFoundException("Story not found");

        _context.Stories.Remove(story);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> LikeStory(Guid storyId, Guid userId) 
    {
        // Kiểm tra xem đã like chưa để tránh lỗi duplicate nếu cần
        var existingLike = await _context.Likes
            .FirstOrDefaultAsync(l => l.UserId == userId && l.StoryId == storyId);
        
        if (existingLike != null) return true;

        var like = new Like 
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            StoryId = storyId,
            PostId = null // EF Core bây giờ đã hiểu PostId có thể null
        };
        
        _context.Likes.Add(like);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnlikeStory(Guid storyId, Guid userId)
    {
        var like = await _context.Likes
            .FirstOrDefaultAsync(l => l.UserId == userId && l.PostId == storyId);

        if (like == null) return false;

        _context.Likes.Remove(like);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task DeleteExpiredStories()
    {
        var expiredStories = await _context.Stories
            .Where(s => s.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync();

        _context.Stories.RemoveRange(expiredStories);
        await _context.SaveChangesAsync();
    }

    private async Task AddHashtagsToStory(Guid storyId, List<string> hashtagNames)
    {
        foreach (var hashtagName in hashtagNames)
        {
            var hashtag = await _context.Hashtags
                .FirstOrDefaultAsync(h => h.Name.ToLower() == hashtagName.ToLower());

            if (hashtag == null)
            {
                hashtag = new Hashtag
                {
                    Id = Guid.NewGuid(),
                    Name = hashtagName.ToLower(),
                    CreatedAt = DateTime.UtcNow
                };
                _context.Hashtags.Add(hashtag);
                await _context.SaveChangesAsync();
            }

            var storyHashtag = new StoryHashtag
            {
                StoryId = storyId,
                HashtagId = hashtag.Id
            };

            _context.StoryHashtags.Add(storyHashtag);
        }

        await _context.SaveChangesAsync();
    }
}
