// File: Entities/Picture.cs

namespace Threads.API.Entities;

public class Picture
{
    public Guid Id { get; set; }
    public Guid PostId { get; set; }

    public string Url { get; set; } // Image URL
    public string PublicId { get; set; } // For image service (e.g., Cloudinary)
    public DateTime CreatedAt { get; set; }

    // Foreign key
    public Post Post { get; set; }
}
