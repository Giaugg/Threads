// File: Controllers/FollowsController.cs

using Microsoft.AspNetCore.Mvc;           // ✅ BẮT BUỘC
using Microsoft.EntityFrameworkCore;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FollowsController : ControllerBase
{
    private readonly AppDbContext _context;

    public FollowsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Follow(Guid followerId, Guid followingId)
    {
        var follow = new Follow
        {
            FollowerId = followerId,
            FollowingId = followingId
        };

        _context.Follows.Add(follow);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> Unfollow(Guid followerId, Guid followingId)
    {
        var follow = await _context.Follows.FindAsync(followerId, followingId);

        if (follow == null) return NotFound();

        _context.Follows.Remove(follow);
        await _context.SaveChangesAsync();

        return Ok();
    }
}