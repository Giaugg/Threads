using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;

namespace Threads.API.Services.Interfaces;

public interface IRepostService
{
    Task<RepostDto> CreateRepost(Guid userId, CreateRepostDto dto);
    Task<List<RepostDto>> GetUserReposts(Guid userId);
    Task<List<RepostDto>> GetPostReposts(Guid postId);
    Task DeleteRepost(Guid repostId);
    Task<bool> IsPostReposted(Guid postId, Guid userId);
}
