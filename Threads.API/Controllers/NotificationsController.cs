using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;
using Microsoft.AspNetCore.SignalR;
using Threads.API.Hubs; // ✅ nhớ import đúng namespace của NotificationHub

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<NotificationHub> _hub;

    // ✅ FIX: inject BOTH context + hub
    public NotificationsController(
        AppDbContext context,
        IHubContext<NotificationHub> hub
    )
    {
        _context = context;
        _hub = hub;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> Get(Guid userId)
    {
        var data = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        return Ok(data);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkRead(Guid id)
    {
        var noti = await _context.Notifications.FindAsync(id);
        if (noti == null) return NotFound();

        noti.IsRead = true;
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var noti = await _context.Notifications.FindAsync(id);
        if (noti == null) return NotFound();

        _context.Notifications.Remove(noti);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("mark-all-read/{userId}")]
    public async Task<IActionResult> MarkAllRead(Guid userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var noti in notifications)
        {
            noti.IsRead = true;
        }

        await _context.SaveChangesAsync();

        return Ok(new { markedCount = notifications.Count });
    }

    // 🔥 TEST REALTIME
    [HttpPost("test")]
    public async Task<IActionResult> Test([FromQuery] string userId)
    {
        var data = new
        {
            id = Guid.NewGuid(),
            message = "🔥 Test notification",
            postId = Guid.NewGuid(),
            createdAt = DateTime.Now
        };

        // ✅ gửi realtime
        await _hub.Clients.Group(userId)
            .SendAsync("ReceiveNotification", data);

        return Ok("Sent!");
    }
}