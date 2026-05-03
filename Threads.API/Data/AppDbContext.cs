// File: Data/AppDbContext.cs

using Microsoft.EntityFrameworkCore;
using Threads.API.Entities;

namespace Threads.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Follow> Follows { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Hashtag> Hashtags { get; set; }
    public DbSet<PostHashtag> PostHashtags { get; set; }
    public DbSet<Picture> Pictures { get; set; }
    public DbSet<Repost> Reposts { get; set; }
    public DbSet<Story> Stories { get; set; }
    public DbSet<StoryHashtag> StoryHashtags { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ========================
        // FOLLOW (self relationship)
        // ========================
        modelBuilder.Entity<Follow>()
            .HasKey(f => new { f.FollowerId, f.FollowingId });

        modelBuilder.Entity<Follow>()
            .HasOne(f => f.Follower)
            .WithMany(u => u.Following)
            .HasForeignKey(f => f.FollowerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Follow>()
            .HasOne(f => f.Following)
            .WithMany(u => u.Followers)
            .HasForeignKey(f => f.FollowingId)
            .OnDelete(DeleteBehavior.Restrict);

        // ========================
        // POST
        // ========================
        modelBuilder.Entity<Post>()
            .HasOne(p => p.User)
            .WithMany(u => u.Posts)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ========================
        // LIKE (many-to-many)
        // ========================
        modelBuilder.Entity<Like>(entity =>
            {
                // Khai báo Id là khóa chính
                entity.HasKey(l => l.Id);

                // Quan hệ với User (Bắt buộc)
                entity.HasOne(l => l.User)
                    .WithMany(u => u.Likes)
                    .HasForeignKey(l => l.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Quan hệ với Post (Không bắt buộc - IsRequired(false))
                entity.HasOne(l => l.Post)
                    .WithMany(p => p.Likes)
                    .HasForeignKey(l => l.PostId)
                    .IsRequired(false) 
                    .OnDelete(DeleteBehavior.Restrict); // Dùng Restrict để tránh lỗi Multiple Cascade Paths

                // Quan hệ với Story (Không bắt buộc - IsRequired(false))
                entity.HasOne(l => l.Story)
                    .WithMany(s => s.Likes)
                    .HasForeignKey(l => l.StoryId)
                    .IsRequired(false) 
                    .OnDelete(DeleteBehavior.NoAction);
                });

        // ========================
        // COMMENT
        // ========================
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict); // ✅ FIX

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Post)
            .WithMany(p => p.Comments)
            .HasForeignKey(c => c.PostId)
            .OnDelete(DeleteBehavior.Cascade); // giữ lại

        // ========================
        // NOTIFICATION
        // ========================
        modelBuilder.Entity<Notification>()
            .HasOne<User>()
            .WithMany(u => u.Notifications)
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ========================
        // INDEX (quan trọng cho performance)
        // ========================
        modelBuilder.Entity<Post>()
            .HasIndex(p => p.CreatedAt);

        modelBuilder.Entity<Follow>()
            .HasIndex(f => f.FollowerId);

        modelBuilder.Entity<Follow>()
            .HasIndex(f => f.FollowingId);


        modelBuilder.Entity<Post>()
            .HasOne(p => p.OriginalPost)
            .WithMany()
            .HasForeignKey(p => p.OriginalPostId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.ParentComment)
            .WithMany()
            .HasForeignKey(c => c.ParentCommentId)
            .OnDelete(DeleteBehavior.Restrict);

        // ========================
        // PICTURE
        // ========================
        modelBuilder.Entity<Picture>()
            .HasOne(pic => pic.Post)
            .WithMany(p => p.Pictures)
            .HasForeignKey(pic => pic.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        // ========================
        // HASHTAG (many-to-many with Post)
        // ========================
        modelBuilder.Entity<PostHashtag>()
            .HasKey(ph => new { ph.PostId, ph.HashtagId });

        modelBuilder.Entity<PostHashtag>()
            .HasOne(ph => ph.Post)
            .WithMany(p => p.PostHashtags)
            .HasForeignKey(ph => ph.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PostHashtag>()
            .HasOne(ph => ph.Hashtag)
            .WithMany(h => h.PostHashtags)
            .HasForeignKey(ph => ph.HashtagId)
            .OnDelete(DeleteBehavior.Cascade);

        // ========================
        // REPOST
        // ========================
        modelBuilder.Entity<Repost>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reposts)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Repost>()
            .HasOne(r => r.OriginalPost)
            .WithMany(p => p.Reposts)
            .HasForeignKey(r => r.OriginalPostId)
            .OnDelete(DeleteBehavior.Cascade);

        // ========================
        // STORY (many-to-many with Hashtag)
        // ========================
        modelBuilder.Entity<Story>()
            .HasOne(s => s.User)
            .WithMany(u => u.Stories)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<StoryHashtag>()
            .HasKey(sh => new { sh.StoryId, sh.HashtagId });

        modelBuilder.Entity<StoryHashtag>()
            .HasOne(sh => sh.Story)
            .WithMany(s => s.StoryHashtags)
            .HasForeignKey(sh => sh.StoryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<StoryHashtag>()
            .HasOne(sh => sh.Hashtag)
            .WithMany(h => h.StoryHashtags)
            .HasForeignKey(sh => sh.HashtagId)
            .OnDelete(DeleteBehavior.Cascade);

        // ========================
        // INDEXES FOR NEW ENTITIES
        // ========================
        modelBuilder.Entity<Hashtag>()
            .HasIndex(h => h.Name)
            .IsUnique();

        modelBuilder.Entity<Picture>()
            .HasIndex(p => p.PostId);

        modelBuilder.Entity<Repost>()
            .HasIndex(r => r.UserId);

        modelBuilder.Entity<Repost>()
            .HasIndex(r => r.OriginalPostId);

        modelBuilder.Entity<Story>()
            .HasIndex(s => s.UserId);

        modelBuilder.Entity<Story>()
            .HasIndex(s => s.ExpiresAt);

        // LIKE -> STORY
        

        modelBuilder.Entity<Post>()
        .HasOne<User>()
        .WithMany()
        .HasForeignKey(p => p.RepostUserId)
        .OnDelete(DeleteBehavior.Restrict);
    }
}