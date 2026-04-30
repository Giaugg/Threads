using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

namespace Threads.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilesController : ControllerBase
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"
    };

    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        // Validation
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded." });

        if (file.Length > MaxFileSize)
            return BadRequest(new { message = "File size must not exceed 5MB." });

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            return BadRequest(new { message = "Only image files are allowed." });

        try
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            
            // Create directory if it doesn't exist
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Generate unique filename
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            // Save file
            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Generate public URL
            var scheme = Request.Scheme;
            var host = Request.Host;
            var url = $"{scheme}://{host}/uploads/{fileName}";

            return Ok(new { url, fileName });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to upload file: " + ex.Message });
        }
    }

    [HttpDelete("{fileName}")]
    public IActionResult Delete(string fileName)
    {
        if (string.IsNullOrEmpty(fileName))
            return BadRequest(new { message = "File name is required." });

        try
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            var filePath = Path.Combine(uploadsFolder, fileName);

            // Security: Ensure file is in uploads folder
            var fullPath = Path.GetFullPath(filePath);
            var uploadsFullPath = Path.GetFullPath(uploadsFolder);
            
            if (!fullPath.StartsWith(uploadsFullPath))
                return BadRequest(new { message = "Invalid file path." });

            if (!System.IO.File.Exists(filePath))
                return NotFound(new { message = "File not found." });

            System.IO.File.Delete(filePath);
            return Ok(new { message = "File deleted successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to delete file: " + ex.Message });
        }
    }
}
