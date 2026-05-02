using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Threads.API.Dtos;
using Threads.API.Services;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HashtagsController : ControllerBase
{
    private readonly HashtagService _hashtagService;

    public HashtagsController(HashtagService hashtagService)
    {
        _hashtagService = hashtagService;
    }

    // GET all hashtags
    [HttpGet]
    public async Task<IActionResult> GetAllHashtags()
    {
        var hashtags = await _hashtagService.GetAllHashtags();
        return Ok(hashtags);
    }

    // GET hashtag by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetHashtagById(Guid id)
    {
        var hashtag = await _hashtagService.GetHashtagById(id);
        if (hashtag == null) return NotFound("Hashtag not found");
        return Ok(hashtag);
    }

    // GET hashtag by name
    [HttpGet("search/{name}")]
    public async Task<IActionResult> GetHashtagByName(string name)
    {
        var hashtag = await _hashtagService.GetHashtagByName(name);
        if (hashtag == null) return NotFound("Hashtag not found");
        return Ok(hashtag);
    }

    // GET posts by hashtag
    [HttpGet("posts/{hashtagName}")]
    public async Task<IActionResult> GetPostsByHashtag(string hashtagName)
    {
        var posts = await _hashtagService.GetPostsByHashtag(hashtagName);
        return Ok(posts);
    }

    // CREATE hashtag
    [HttpPost]
    public async Task<IActionResult> CreateHashtag(CreateHashtagDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Hashtag name is required");

        var hashtag = await _hashtagService.CreateHashtag(dto);
        return CreatedAtAction(nameof(GetHashtagById), new { id = hashtag.Id }, hashtag);
    }

    // ADD hashtags to post
    [HttpPost("post/{postId}")]
    public async Task<IActionResult> AddHashtagsToPost(Guid postId, [FromBody] List<string> hashtagNames)
    {
        try
        {
            await _hashtagService.AddHashtagsToPost(postId, hashtagNames);
            return Ok("Hashtags added successfully");
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // REMOVE hashtags from post
    [HttpDelete("post/{postId}")]
    [Authorize]
    public async Task<IActionResult> RemoveHashtagsFromPost(Guid postId, [FromBody] List<string> hashtagNames)
    {
        try
        {
            await _hashtagService.RemoveHashtagsFromPost(postId, hashtagNames);
            return Ok("Hashtags removed successfully");
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}
