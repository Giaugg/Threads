# Threads - New Features Documentation

## Overview
This document outlines the new features added to the Threads application:
1. **Hashtags** - Search and find posts with the same hashtag
2. **Pictures** - Separate image storage table
3. **Reposts** - Repost other users' posts with optional captions
4. **Stories** - Temporary posts that auto-hide after 24 hours
5. **Admin Dashboard** - Manage users, posts, stories, and other components

---

## 1. Hashtags Feature

### Database Schema
- **Hashtag Table**: Stores unique hashtags with creation timestamp
- **PostHashtag Table**: Junction table for many-to-many relationship between Posts and Hashtags
- **StoryHashtag Table**: Junction table for many-to-many relationship between Stories and Hashtags

### Backend API Endpoints

```
GET /api/hashtags                          # Get all hashtags
GET /api/hashtags/{id}                     # Get hashtag by ID
GET /api/hashtags/search/{name}            # Search hashtag by name
GET /api/hashtags/posts/{hashtagName}      # Get posts with specific hashtag
POST /api/hashtags                         # Create new hashtag
POST /api/hashtags/post/{postId}           # Add hashtags to post
DELETE /api/hashtags/post/{postId}         # Remove hashtags from post
```

### Frontend Components

**HashtagSearch.tsx**
```tsx
import { HashtagSearch } from "@/features/hashtag/HashtagSearch";

export default function SearchPage() {
  const handleHashtagSelect = (hashtag: string) => {
    // Navigate to hashtag posts or filter
  };

  return <HashtagSearch onHashtagSelect={handleHashtagSelect} />;
}
```

**useHashtag Hook**
```tsx
const { hashtags, loading, error, getAllHashtags, getHashtagByName } = useHashtag();

useEffect(() => {
  getAllHashtags();
}, []);
```

---

## 2. Pictures Feature

### Database Schema
- **Picture Table**: Stores multiple images per post
  - `id`: Unique identifier
  - `postId`: Foreign key to Post
  - `url`: Image URL
  - `publicId`: ID for image service (Cloudinary, etc.)
  - `createdAt`: Timestamp

### Usage
Instead of using `Post.ImageUrl` for a single image, you can now:
1. Store multiple images in the `Pictures` table
2. Each image has its own URL and metadata
3. Images are automatically deleted when post is deleted (cascade delete)

### Backend Example
```csharp
// Controller
[HttpPost("posts/{postId}/pictures")]
public async Task<IActionResult> AddPictureToPost(Guid postId, PictureDto dto)
{
    var picture = new Picture
    {
        Id = Guid.NewGuid(),
        PostId = postId,
        Url = dto.Url,
        PublicId = dto.PublicId,
        CreatedAt = DateTime.UtcNow
    };
    
    _context.Pictures.Add(picture);
    await _context.SaveChangesAsync();
    return Ok(picture);
}
```

---

## 3. Reposts Feature

### Database Schema
- **Repost Table**:
  - `id`: Unique identifier
  - `userId`: User who is reposting
  - `originalPostId`: Original post being reposted
  - `caption`: Optional caption added by reposter
  - `createdAt`: Timestamp

### Backend API Endpoints

```
POST /api/reposts                          # Create repost
GET /api/reposts/user/{userId}             # Get user's reposts
GET /api/reposts/post/{postId}             # Get post's reposts
GET /api/reposts/check/{postId}            # Check if user reposted
DELETE /api/reposts/{repostId}             # Delete repost
```

### Frontend Components

**RepostButton.tsx**
```tsx
import { RepostButton } from "@/features/repost/RepostButton";

export default function PostCard() {
  return (
    <div>
      <p>Post content</p>
      <RepostButton 
        postId={postId} 
        onRepost={() => console.log("Reposted!")}
      />
    </div>
  );
}
```

**useRepost Hook**
```tsx
const { createRepost, deleteRepost, getUserReposts } = useRepost();

const handleRepost = async () => {
  const repost = await createRepost(postId, "My custom caption");
  if (repost) {
    // Show success message
  }
};
```

---

## 4. Stories Feature

### Database Schema
- **Story Table**:
  - `id`: Unique identifier
  - `userId`: Author of the story
  - `content`: Story text
  - `imageUrl`: Optional image
  - `createdAt`: Creation timestamp
  - `expiresAt`: Auto-hide timestamp (24 hours later)
  - `storyHashtags`: Many-to-many relationship with hashtags

### Features
- Auto-expire after 24 hours
- Support for text and images
- Hashtag support
- Like functionality
- Only shows active stories (not expired)

### Backend API Endpoints

```
POST /api/stories                          # Create story
GET /api/stories/user/{userId}             # Get user's active stories
GET /api/stories/following                 # Get stories from following users
GET /api/stories/{storyId}                 # Get single story
POST /api/stories/{storyId}/like           # Like story
POST /api/stories/{storyId}/unlike         # Unlike story
DELETE /api/stories/{storyId}              # Delete story
POST /api/stories/maintenance/cleanup      # Delete expired stories
```

### Frontend Components

**CreateStory.tsx**
```tsx
import { CreateStory } from "@/features/story/CreateStory";

export default function StoryPage() {
  return (
    <CreateStory 
      onStoryCreated={() => {
        // Refresh stories
      }}
    />
  );
}
```

**StoryCard.tsx**
```tsx
import { StoryCard } from "@/features/story/StoryCard";

export default function StoryFeed() {
  return (
    <div>
      {stories.map(story => (
        <StoryCard 
          key={story.id}
          story={story}
          onDelete={() => deleteStory(story.id)}
        />
      ))}
    </div>
  );
}
```

**useStory Hook**
```tsx
const { 
  stories, 
  createStory, 
  getFollowingStories, 
  likeStory, 
  deleteStory 
} = useStory();

useEffect(() => {
  getFollowingStories();
}, []);
```

---

## 5. Admin Dashboard

### Purpose
Manage all application components:
- Users (view, edit, delete)
- Posts (view, delete)
- Stories (view, delete)
- Hashtags (view, delete)
- Reposts (view, delete)
- Comments (view, delete)

### Dashboard Statistics
- Total users, posts, stories
- Active vs expired stories
- Total likes, comments, reposts, hashtags

### Backend API Endpoints

```
# Statistics
GET /api/admin/statistics

# Users Management
GET /api/admin/users?page=1&pageSize=10
GET /api/admin/users/{userId}
PUT /api/admin/users/{userId}
DELETE /api/admin/users/{userId}

# Posts Management
GET /api/admin/posts?page=1&pageSize=10
DELETE /api/admin/posts/{postId}

# Stories Management
GET /api/admin/stories?page=1&pageSize=10
DELETE /api/admin/stories/{storyId}

# Hashtags Management
GET /api/admin/hashtags?page=1&pageSize=10
DELETE /api/admin/hashtags/{hashtagId}

# Reposts Management
GET /api/admin/reposts?page=1&pageSize=10
DELETE /api/admin/reposts/{repostId}

# Comments Management
GET /api/admin/comments?page=1&pageSize=10
DELETE /api/admin/comments/{commentId}
```

### Frontend Components

**AdminDashboard.tsx**
```tsx
import { AdminDashboard } from "@/features/admin/AdminDashboard";

export default function AdminPage() {
  return <AdminDashboard />;
}
```

**useAdmin Hook**
```tsx
const { 
  statistics, 
  getStatistics, 
  getAllUsers, 
  deleteUser,
  getAllPosts,
  deletePost 
} = useAdmin();

useEffect(() => {
  getStatistics();
}, []);
```

---

## Integration Guide

### 1. Backend Setup

1. Ensure migrations are applied:
```bash
cd Threads.API
dotnet ef database update
```

2. Register services in `Program.cs`:
```csharp
builder.Services.AddScoped<HashtagService>();
builder.Services.AddScoped<RepostService>();
builder.Services.AddScoped<StoryService>();
```

3. Controllers are automatically discovered and registered.

### 2. Frontend Setup

1. Import components where needed:
```tsx
import { CreateStory } from "@/features/story/CreateStory";
import { RepostButton } from "@/features/repost/RepostButton";
import { HashtagSearch } from "@/features/hashtag/HashtagSearch";
import { AdminDashboard } from "@/features/admin/AdminDashboard";
```

2. Add routes for new pages:
```tsx
// In router.tsx or routing configuration
{
  path: "/stories",
  component: StoryPage
},
{
  path: "/admin",
  component: AdminPage
}
```

### 3. Database Verification

Check that all tables are created:
- `Hashtags`
- `PostHashtags`
- `StoryHashtags`
- `Pictures`
- `Reposts`
- `Stories`

---

## Important Notes

### Story Expiration
- Stories expire after 24 hours automatically
- Run cleanup API endpoint periodically: `POST /api/stories/maintenance/cleanup`
- Consider scheduling this as a background job

### Hashtag Best Practices
- Store hashtags in lowercase for consistency
- Use `#name` format in UI but store just `name` in DB
- Implement autocomplete based on popular hashtags

### Admin Access
- Currently, all authenticated users can access admin endpoints
- Consider adding role-based authorization:
```csharp
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase { }
```

### Performance Optimization
- Add indexes on:
  - `Hashtag.Name` (already done - unique index)
  - `Story.ExpiresAt` (already done)
  - `Repost.UserId` and `Repost.OriginalPostId` (already done)
  - `Picture.PostId` (already done)

---

## File Structure

### Backend
```
Threads.API/
├── Entities/
│   ├── Hashtag.cs
│   ├── PostHashtag.cs
│   ├── Picture.cs
│   ├── Repost.cs
│   ├── Story.cs
│   └── StoryHashtag.cs
├── Dtos/
│   ├── HashtagDto.cs
│   ├── PictureDto.cs
│   ├── RepostDto.cs
│   ├── StoryDto.cs
│   └── Create*.cs
├── Services/
│   ├── HashtagService.cs
│   ├── RepostService.cs
│   └── StoryService.cs
├── Controllers/
│   ├── HashtagsController.cs
│   ├── RepostsController.cs
│   ├── StoriesController.cs
│   └── AdminController.cs
└── Migrations/
    └── *_AddHashtagPictureRepostStory.cs
```

### Frontend
```
threads-fe/src/features/
├── hashtag/
│   ├── hashtagAPI.ts
│   ├── useHashtag.ts
│   ├── HashtagSearch.tsx
│   └── HashtagSearch.css
├── repost/
│   ├── repostAPI.ts
│   ├── useRepost.ts
│   ├── RepostButton.tsx
│   └── RepostButton.css
├── story/
│   ├── storyAPI.ts
│   ├── useStory.ts
│   ├── StoryCard.tsx
│   ├── CreateStory.tsx
│   ├── Story.css
│   └── CreateStory.css
└── admin/
    ├── adminAPI.ts
    ├── useAdmin.ts
    ├── AdminDashboard.tsx
    └── AdminDashboard.css
```

---

## Testing

### Manual Testing Checklist
- [ ] Create a hashtag via API
- [ ] Add hashtags to a post
- [ ] Search posts by hashtag
- [ ] Create a story with hashtags
- [ ] Verify story expires after 24 hours
- [ ] Create a repost with caption
- [ ] Delete a repost
- [ ] Access admin dashboard
- [ ] View statistics
- [ ] Delete a user via admin panel
- [ ] Delete expired stories

### Example Curl Requests

```bash
# Create hashtag
curl -X POST http://localhost:5000/api/hashtags \
  -H "Content-Type: application/json" \
  -d '{"name":"technology"}'

# Create story
curl -X POST http://localhost:5000/api/stories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"content":"My story","hashtags":["tech"]}'

# Create repost
curl -X POST http://localhost:5000/api/reposts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"originalPostId":"<postId>","caption":"Check this out"}'

# Get admin statistics
curl -X GET http://localhost:5000/api/admin/statistics \
  -H "Authorization: Bearer <token>"
```

---

## Future Enhancements

1. **Trending Hashtags** - Show trending hashtags based on usage
2. **Story Analytics** - Track story views and engagement
3. **Advanced Admin Features** - Ban users, moderate content
4. **Story Reactions** - More than just likes (emojis, etc.)
5. **Scheduled Posts** - Schedule posts/stories for later
6. **Story Archives** - Keep expired stories in archive
7. **Repost Stats** - Track repost analytics
8. **Hashtag Suggestions** - AI-powered hashtag recommendations

---

## Support

For issues or questions about these features, please refer to the API documentation or contact the development team.
