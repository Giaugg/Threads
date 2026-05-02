using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Threads.API.Dtos;
using Threads.API.Services;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StoriesController : ControllerBase
{
    private readonly StoryService _storyService;

    public StoriesController(StoryService storyService)
    {
        _storyService = storyService;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMyStories()
    {
        // Lấy UserId từ Token của người đang đăng nhập
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid user ID");

        // Tái sử dụng hàm GetActiveStoriesByUser của StoryService
        var stories = await _storyService.GetActiveStoriesByUser(userId);
        return Ok(stories);
    }

    // CREATE story
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateStory(CreateStoryDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid user ID");

        try
        {
            var story = await _storyService.CreateStory(userId, dto);
            return CreatedAtAction(nameof(GetStoryById), new { storyId = story.Id }, story);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // GET user's active stories
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserStories(Guid userId)
    {
        var stories = await _storyService.GetActiveStoriesByUser(userId);
        return Ok(stories);
    }

    // GET stories from following users
    [HttpGet("following")]
    [Authorize]
    public async Task<IActionResult> GetFollowingStories()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid user ID");

        var stories = await _storyService.GetFollowingStories(userId);
        return Ok(stories);
    }

    // GET story by ID
    [HttpGet("{storyId}")]
    public async Task<IActionResult> GetStoryById(Guid storyId)
    {
        var story = await _storyService.GetStoryById(storyId);
        if (story == null) return NotFound("Story not found or expired");
        return Ok(story);
    }

    // LIKE story
    [HttpPost("{storyId}/like")]
    [Authorize]
    public async Task<IActionResult> LikeStory(Guid storyId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid user ID");

        var result = await _storyService.LikeStory(storyId, userId);
        return Ok(new { success = result, message = "Story liked" });
    }

    // UNLIKE story
    [HttpPost("{storyId}/unlike")]
    [Authorize]
    public async Task<IActionResult> UnlikeStory(Guid storyId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid user ID");

        var result = await _storyService.UnlikeStory(storyId, userId);
        if (!result) return NotFound("Like not found");
        return Ok(new { success = result, message = "Story unliked" });
    }

    // DELETE story
    [HttpDelete("{storyId}")]
    [Authorize]
    public async Task<IActionResult> DeleteStory(Guid storyId)
    {
        try
        {
            await _storyService.DeleteStory(storyId);
            return Ok("Story deleted successfully");
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // DELETE expired stories (admin/maintenance)
    [HttpPost("maintenance/cleanup")]
    [Authorize]
    public async Task<IActionResult> DeleteExpiredStories()
    {
        await _storyService.DeleteExpiredStories();
        return Ok("Expired stories cleaned up");
    }
}
