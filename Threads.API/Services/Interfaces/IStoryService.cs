using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;

namespace Threads.API.Services.Interfaces;

public interface IStoryService
{
    Task<StoryDto> CreateStory(Guid userId, CreateStoryDto dto);
    Task<List<StoryDto>> GetActiveStoriesByUser(Guid userId);
    Task<List<StoryDto>> GetFollowingStories(Guid userId);
    Task<StoryDto?> GetStoryById(Guid storyId);
    Task DeleteStory(Guid storyId);
    Task<bool> LikeStory(Guid storyId, Guid userId);
    Task<bool> UnlikeStory(Guid storyId, Guid userId);
    Task DeleteExpiredStories();
}
