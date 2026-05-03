using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Threads.API.Services;

public class HashtagService
{
    private readonly AppDbContext _context;

    public HashtagService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<HashtagDto>> GetAllHashtags()
    {
        return await _context.Hashtags
            .Include(h => h.PostHashtags)
            .Select(h => new HashtagDto
            {
                Id = h.Id,
                Name = h.Name,
                CreatedAt = h.CreatedAt,
                PostCount = h.PostHashtags.Count
            })
            .OrderByDescending(h => h.PostCount)
            .ToListAsync();
    }

    public async Task<HashtagDto?> GetHashtagById(Guid id)
    {
        var hashtag = await _context.Hashtags
            .Include(h => h.PostHashtags)
            .FirstOrDefaultAsync(h => h.Id == id);

        if (hashtag == null) return null;

        return new HashtagDto
        {
            Id = hashtag.Id,
            Name = hashtag.Name,
            CreatedAt = hashtag.CreatedAt,
            PostCount = hashtag.PostHashtags.Count
        };
    }

    public async Task<HashtagDto?> GetHashtagByName(string name)
    {
        var hashtag = await _context.Hashtags
            .Include(h => h.PostHashtags)
            .FirstOrDefaultAsync(h => h.Name.ToLower() == name.ToLower());

        if (hashtag == null) return null;

        return new HashtagDto
        {
            Id = hashtag.Id,
            Name = hashtag.Name,
            CreatedAt = hashtag.CreatedAt,
            PostCount = hashtag.PostHashtags.Count
        };
    }

    public async Task<HashtagDto> CreateHashtag(CreateHashtagDto dto)
    {
        var existingHashtag = await _context.Hashtags
            .FirstOrDefaultAsync(h => h.Name.ToLower() == dto.Name.ToLower());

        if (existingHashtag != null)
        {
            return new HashtagDto
            {
                Id = existingHashtag.Id,
                Name = existingHashtag.Name,
                CreatedAt = existingHashtag.CreatedAt,
                PostCount = existingHashtag.PostHashtags.Count
            };
        }

        var hashtag = new Hashtag
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.ToLower(),
            CreatedAt = DateTime.Now     
        };

        _context.Hashtags.Add(hashtag);
        await _context.SaveChangesAsync();

        return new HashtagDto
        {
            Id = hashtag.Id,
            Name = hashtag.Name,
            CreatedAt = hashtag.CreatedAt,
            PostCount = 0
        };
    }

    public async Task<List<PostDto>> GetPostsByHashtag(string hashtagName)
    {
        var posts = await _context.PostHashtags
            .Where(ph => ph.Hashtag.Name.ToLower() == hashtagName.ToLower())
            .Include(ph => ph.Post)
            .ThenInclude(p => p.User)
            .Include(ph => ph.Post)
            .ThenInclude(p => p.Likes)
            .Select(ph => new PostDto
            {
                Id = ph.Post.Id,
                Content = ph.Post.Content,
                ImageUrl = ph.Post.ImageUrl,
                CreatedAt = ph.Post.CreatedAt,
                User = new UserDto
                {
                    Id = ph.Post.User.Id,
                    Username = ph.Post.User.Username,
                    AvatarUrl = ph.Post.User.AvatarUrl
                },
                LikesCount = ph.Post.Likes.Count,
                IsLiked = false
            })
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return posts;
    }

    public async Task AddHashtagsToPost(Guid postId, List<string> hashtagNames)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post == null) throw new KeyNotFoundException("Post not found");

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
                   CreatedAt = DateTime.Now     
 // Giờ Việt Nam
                };
                _context.Hashtags.Add(hashtag);
            }

            var postHashtag = new PostHashtag
            {
                PostId = postId,
                HashtagId = hashtag.Id
            };

            _context.PostHashtags.Add(postHashtag);
        }

        await _context.SaveChangesAsync();
    }

    public async Task RemoveHashtagsFromPost(Guid postId, List<string> hashtagNames)
    {
        var postHashtags = await _context.PostHashtags
            .Where(ph => ph.PostId == postId)
            .Include(ph => ph.Hashtag)
            .Where(ph => hashtagNames.Select(h => h.ToLower()).Contains(ph.Hashtag.Name))
            .ToListAsync();

        _context.PostHashtags.RemoveRange(postHashtags);
        await _context.SaveChangesAsync();
    }
}
