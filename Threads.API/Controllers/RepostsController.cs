using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Threads.API.Dtos;
using Threads.API.Services;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RepostsController : ControllerBase
{
    private readonly RepostService _repostService;

    public RepostsController(RepostService repostService)
    {
        _repostService = repostService;
    }

    // CREATE repost
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateRepost(CreateRepostDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid user ID");

        try
        {
            var repost = await _repostService.CreateRepost(userId, dto);
            return CreatedAtAction(nameof(GetRepostsByPost), new { postId = dto.OriginalPostId }, repost);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // GET user's reposts
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserReposts(Guid userId)
    {
        var reposts = await _repostService.GetUserReposts(userId);
        return Ok(reposts);
    }

    // GET post's reposts
    [HttpGet("post/{postId}")]
    public async Task<IActionResult> GetRepostsByPost(Guid postId)
    {
        var reposts = await _repostService.GetPostReposts(postId);
        return Ok(reposts);
    }

    // CHECK if user reposted this post
    [HttpGet("check/{postId}")]
    [Authorize]
    public async Task<IActionResult> IsPostReposted(Guid postId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid user ID");

        var isReposted = await _repostService.IsPostReposted(postId, userId);
        return Ok(new { isReposted });
    }

    // DELETE repost
    [HttpDelete("{repostId}")]
    [Authorize]
    public async Task<IActionResult> DeleteRepost(Guid repostId)
    {
        try
        {
            await _repostService.DeleteRepost(repostId);
            return Ok("Repost deleted successfully");
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}
