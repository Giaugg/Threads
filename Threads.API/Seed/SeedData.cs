// File: Data/Seed/SeedData.cs

using Threads.API.Entities;

namespace Threads.API.Data.Seed;

public static class SeedData
{
    public static async Task Initialize(AppDbContext context)
    {
        if (context.Users.Any()) return;

        var random = new Random();

        // ===== USERS =====
        var users = new List<User>();

        for (int i = 1; i <= 20; i++)
        {
            users.Add(new User
            {
                Id = Guid.NewGuid(),
                Username = $"user{i}",
                Email = $"user{i}@gmail.com",
                PasswordHash = "123",
                AvatarUrl = $"https://i.pravatar.cc/150?img={i}",
                Bio = $"This is user{i}'s bio.",
                CreatedAt = DateTime.UtcNow
            });
        }

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();

        // ===== POSTS =====
        var posts = new List<Post>();
        var sampleContents = new[]
        {
            "Hello world 🌍",
            "First post 🔥",
            "Coding all day 💻",
            "Life is good 😎",
            "Threads clone 😆",
            "Backend C# 🚀",
            "Coffee time ☕",
            "Debugging again 😭"
        };

        foreach (var user in users)
        {
            int postCount = random.Next(3, 8);

            for (int i = 0; i < postCount; i++)
            {
                posts.Add(new Post
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    Content = sampleContents[random.Next(sampleContents.Length)],
                    CreatedAt = DateTime.UtcNow.AddMinutes(-random.Next(0, 1000))
                });
            }
        }

        await context.Posts.AddRangeAsync(posts);
        await context.SaveChangesAsync();

        // ===== FOLLOW =====
        var follows = new List<Follow>();

        foreach (var user in users)
        {
            var others = users.Where(u => u.Id != user.Id).ToList();

            int followCount = random.Next(3, 10);

            foreach (var target in others.OrderBy(x => random.Next()).Take(followCount))
            {
                follows.Add(new Follow
                {
                    FollowerId = user.Id,
                    FollowingId = target.Id
                });
            }
        }

        await context.Follows.AddRangeAsync(follows);
        await context.SaveChangesAsync();

        // ===== LIKE =====
        var likes = new List<Like>();

        foreach (var post in posts)
        {
            int likeCount = random.Next(1, 10);

            foreach (var user in users.OrderBy(x => random.Next()).Take(likeCount))
            {
                likes.Add(new Like
                {
                    UserId = user.Id,
                    PostId = post.Id
                });
            }
        }

        await context.Likes.AddRangeAsync(likes);
        await context.SaveChangesAsync();

        // ===== COMMENT =====
        var comments = new List<Comment>();

        var commentSamples = new[]
        {
            "Nice post!",
            "🔥🔥🔥",
            "Agree!",
            "Lol 😂",
            "Interesting 🤔",
            "Cool 😎"
        };

        foreach (var post in posts)
        {
            int commentCount = random.Next(0, 5);

            foreach (var user in users.OrderBy(x => random.Next()).Take(commentCount))
            {
                comments.Add(new Comment
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    PostId = post.Id,
                    Content = commentSamples[random.Next(commentSamples.Length)],
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await context.Comments.AddRangeAsync(comments);
        await context.SaveChangesAsync();
    }
}