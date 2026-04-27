// File: Controllers/UsersController.cs

using Microsoft.AspNetCore.Mvc;           // ✅ BẮT BUỘC
using Microsoft.EntityFrameworkCore;
using Threads.API.Data;
using Threads.API.Dtos;
using Threads.API.Entities;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/users
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.Users.ToListAsync());
    }

    // GET: api/users/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var user = await _context.Users
            .Include(u => u.Posts)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user == null) return NotFound();

        return Ok(user);
    }

    // PUT: api/users/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.Username = dto.Username;
        user.Bio = dto.Bio;
        user.AvatarUrl = dto.AvatarUrl;

        await _context.SaveChangesAsync();

        return Ok(user);
    }

    // DELETE: api/users/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok();
    }
}