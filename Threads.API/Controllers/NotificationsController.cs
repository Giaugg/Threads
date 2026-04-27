// File: Controllers/NotificationsController.cs

using Microsoft.AspNetCore.Mvc;           // ✅ BẮT BUỘC
using Microsoft.EntityFrameworkCore;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public NotificationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> Get(Guid userId)
    {
        var noti = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        return Ok(noti);
    }
}