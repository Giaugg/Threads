using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Threads.API.Services.Interfaces;

public interface IHashtagService
{
    Task<List<HashtagDto>> GetAllHashtags();
    Task<HashtagDto?> GetHashtagById(Guid id);
    Task<HashtagDto?> GetHashtagByName(string name);
    Task<HashtagDto> CreateHashtag(CreateHashtagDto dto);
    Task<List<PostDto>> GetPostsByHashtag(string hashtagName);
    Task AddHashtagsToPost(Guid postId, List<string> hashtagNames);
    Task RemoveHashtagsFromPost(Guid postId, List<string> hashtagNames);
}
