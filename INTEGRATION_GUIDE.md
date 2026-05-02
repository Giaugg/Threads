# Integration Guide - Using New Features in Your Pages

This guide shows you how to integrate the new features (Hashtags, Reposts, Stories, Admin) into your existing React pages.

---

## 1. Hashtags Integration

### Simple Hashtag Search Page

```tsx
// src/pages/HashtagPage.tsx
import React, { useState, useEffect } from 'react';
import { HashtagSearch } from '@/features/hashtag/HashtagSearch';
import { hashtagAPI } from '@/features/hashtag/hashtagAPI';

export default function HashtagPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHashtag, setSelectedHashtag] = useState('');

  const handleHashtagSelect = async (hashtag: string) => {
    setLoading(true);
    setSelectedHashtag(hashtag);
    try {
      const data = await hashtagAPI.getPostsByHashtag(hashtag);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hashtag-page">
      <h1>Hashtag Explorer</h1>
      <HashtagSearch onHashtagSelect={handleHashtagSelect} />
      
      {selectedHashtag && (
        <div className="hashtag-results">
          <h2>Posts tagged #{selectedHashtag}</h2>
          {loading ? (
            <p>Loading...</p>
          ) : posts.length > 0 ? (
            <div className="posts-list">
              {posts.map(post => (
                <div key={post.id} className="post-item">
                  <strong>{post.user.username}</strong>
                  <p>{post.content}</p>
                  <small>{new Date(post.createdAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          ) : (
            <p>No posts found for this hashtag</p>
          )}
        </div>
      )}
    </div>
  );
}
```

### Add Hashtags to Existing Post Component

```tsx
// In your PostCard or PostCreate component
import { hashtagAPI } from '@/features/hashtag/hashtagAPI';

const [hashtags, setHashtags] = useState('');

const handlePostCreation = async (content: string) => {
  // First create the post (existing code)
  const post = await createPost(content);
  
  // Then add hashtags
  if (hashtags.trim()) {
    const hashtagList = hashtags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
    
    await hashtagAPI.addHashtagsToPost(post.id, hashtagList);
  }
};

return (
  <div>
    <textarea placeholder="Post content..." onChange={e => setContent(e.target.value)} />
    <input 
      placeholder="Add hashtags (comma-separated)"
      value={hashtags}
      onChange={e => setHashtags(e.target.value)}
    />
    <button onClick={() => handlePostCreation(content)}>Post</button>
  </div>
);
```

---

## 2. Reposts Integration

### Add Repost Button to Post Card

```tsx
// In your existing PostCard component
import { RepostButton } from '@/features/repost/RepostButton';

export function PostCard({ post }) {
  const handleRepost = () => {
    // Refresh repost count or show notification
    console.log('Post reposted!');
  };

  return (
    <div className="post-card">
      <h3>{post.user.username}</h3>
      <p>{post.content}</p>
      
      <div className="post-actions">
        <button onClick={() => likePost(post.id)}>👍 Like</button>
        <RepostButton 
          postId={post.id} 
          onRepost={handleRepost}
        />
        <button onClick={() => openComments(post.id)}>💬 Comment</button>
      </div>
    </div>
  );
}
```

### Reposts Feed Page

```tsx
// src/pages/RepostsFeedPage.tsx
import React, { useEffect } from 'react';
import { useRepost } from '@/features/repost/useRepost';

export default function RepostsFeedPage() {
  const { reposts, loading, error, getUserReposts } = useRepost();
  const userId = getCurrentUserId(); // Your auth logic

  useEffect(() => {
    getUserReposts(userId);
  }, [userId]);

  return (
    <div className="reposts-feed">
      <h1>Your Reposts</h1>
      
      {error && <div className="error">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : reposts.length > 0 ? (
        <div className="reposts-list">
          {reposts.map(repost => (
            <div key={repost.id} className="repost-item">
              <div className="repost-header">
                <img src={repost.user.avatarUrl} alt={repost.user.username} />
                <strong>{repost.user.username}</strong> reposted
              </div>
              
              {repost.caption && (
                <p className="repost-caption">{repost.caption}</p>
              )}
              
              <div className="original-post">
                <div className="original-header">
                  <img src={repost.originalPost.user.avatarUrl} 
                       alt={repost.originalPost.user.username} />
                  <strong>{repost.originalPost.user.username}</strong>
                </div>
                <p>{repost.originalPost.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reposts yet</p>
      )}
    </div>
  );
}
```

---

## 3. Stories Integration

### Stories Section in Feed

```tsx
// Add to your feed page
import { CreateStory } from '@/features/story/CreateStory';
import { StoryCard } from '@/features/story/StoryCard';
import { useStory } from '@/features/story/useStory';

export function StoriesFeed() {
  const { stories, deleteStory, getFollowingStories } = useStory();
  const [showCreateStory, setShowCreateStory] = React.useState(false);

  React.useEffect(() => {
    getFollowingStories();
  }, []);

  const handleStoryDeleted = () => {
    getFollowingStories(); // Refresh
  };

  return (
    <div className="stories-section">
      <div className="stories-header">
        <h2>Stories</h2>
        <button onClick={() => setShowCreateStory(!showCreateStory)}>
          {showCreateStory ? '✕ Close' : '+ Create Story'}
        </button>
      </div>

      {showCreateStory && (
        <CreateStory onStoryCreated={handleStoryDeleted} />
      )}

      <div className="stories-list">
        {stories.map(story => (
          <StoryCard 
            key={story.id}
            story={story}
            onDelete={() => {
              deleteStory(story.id);
              handleStoryDeleted();
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

### User Profile Stories

```tsx
// In your existing ProfilePage
import { useStory } from '@/features/story/useStory';
import { StoryCard } from '@/features/story/StoryCard';

export function UserProfileStories({ userId }) {
  const { stories, getUserStories, deleteStory } = useStory();

  React.useEffect(() => {
    getUserStories(userId);
  }, [userId]);

  return (
    <div className="profile-stories">
      <h3>Stories</h3>
      {stories.length > 0 ? (
        <div className="stories-grid">
          {stories.map(story => (
            <StoryCard 
              key={story.id}
              story={story}
              onDelete={
                isOwnProfile ? () => deleteStory(story.id) : undefined
              }
            />
          ))}
        </div>
      ) : (
        <p>No active stories</p>
      )}
    </div>
  );
}
```

---

## 4. Admin Integration

### Admin Page in Your App

```tsx
// src/pages/AdminPage.tsx
import React from 'react';
import { AdminDashboard } from '@/features/admin/AdminDashboard';
import { ProtectedRoute } from '@/app/ProtectedRoute';

// Wrap with admin check (you should add role-based protection)
export default function AdminPage() {
  // TODO: Add role check - only admins can access
  const isAdmin = checkIsAdmin(); // Your auth logic

  if (!isAdmin) {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div className="admin-page">
      <AdminDashboard />
    </div>
  );
}
```

### Add Admin Link to Navigation

```tsx
// In your Navigation/Header component
import { useAuth } from '@/core/hooks/useAuth';

export function Navigation() {
  const { user } = useAuth();

  return (
    <nav>
      <Link to="/feed">Feed</Link>
      <Link to="/profile">Profile</Link>
      
      {/* Show admin link if user is admin */}
      {user?.role === 'Admin' && (
        <Link to="/admin" className="admin-link">⚙️ Admin</Link>
      )}
    </nav>
  );
}
```

---

## 5. Complete Example: Enhanced Feed Page

```tsx
// src/pages/FeedPage.tsx
import React, { useState, useEffect } from 'react';
import { StoriesFeed } from '@/features/story/StoryCard';
import { HashtagSearch } from '@/features/hashtag/HashtagSearch';
import { RepostButton } from '@/features/repost/RepostButton';
import { hashtagAPI } from '@/features/hashtag/hashtagAPI';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);

  // Load posts
  useEffect(() => {
    loadPosts();
  }, []);

  // Filter by hashtag
  useEffect(() => {
    if (selectedHashtag) {
      loadPostsByHashtag(selectedHashtag);
    } else {
      setFilteredPosts(posts);
    }
  }, [selectedHashtag, posts]);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const loadPostsByHashtag = async (hashtag: string) => {
    try {
      const data = await hashtagAPI.getPostsByHashtag(hashtag);
      setFilteredPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  return (
    <div className="feed-page">
      <aside className="feed-sidebar">
        <h2>Explore</h2>
        <HashtagSearch 
          onHashtagSelect={(tag) => setSelectedHashtag(tag)}
        />
        
        {selectedHashtag && (
          <button 
            onClick={() => setSelectedHashtag(null)}
            className="clear-filter"
          >
            Clear Filter
          </button>
        )}
      </aside>

      <main className="feed-main">
        <StoriesFeed />
        
        <div className="posts-feed">
          {selectedHashtag && (
            <h2>Posts tagged #{selectedHashtag}</h2>
          )}
          
          {filteredPosts.map(post => (
            <article key={post.id} className="post">
              <div className="post-header">
                <img src={post.user.avatarUrl} alt={post.user.username} />
                <strong>{post.user.username}</strong>
              </div>
              
              <p className="post-content">{post.content}</p>
              
              {post.imageUrl && (
                <img src={post.imageUrl} alt="Post" className="post-image" />
              )}
              
              <div className="post-actions">
                <button>👍 {post.likesCount} Likes</button>
                <RepostButton postId={post.id} onRepost={loadPosts} />
                <button>💬 Comment</button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
```

---

## 6. CSS Styling Tips

```css
/* Stories section */
.stories-section {
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 16px;
}

.stories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

/* Hashtag in post */
.post-content {
  font-size: 14px;
  line-height: 1.5;
}

.post-content a[href*="#"] {
  color: #0066cc;
  text-decoration: none;
  font-weight: 500;
}

.post-content a[href*="#"]:hover {
  text-decoration: underline;
}

/* Admin link in nav */
.admin-link {
  background: #f0f0f0;
  padding: 8px 12px;
  border-radius: 4px;
  margin-left: 8px;
}

.admin-link:hover {
  background: #e0e0e0;
}
```

---

## 7. Routing Configuration

```tsx
// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import FeedPage from '@/pages/FeedPage';
import HashtagPage from '@/pages/HashtagPage';
import RepostsFeedPage from '@/pages/RepostsFeedPage';
import AdminPage from '@/pages/AdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'feed', element: <FeedPage /> },
      { path: 'hashtags', element: <HashtagPage /> },
      { path: 'reposts', element: <RepostsFeedPage /> },
      { path: 'admin', element: <AdminPage /> },
      // ... other routes
    ],
  },
]);
```

---

## Quick Copy-Paste Examples

### Import All Hooks
```tsx
import { useHashtag } from '@/features/hashtag/useHashtag';
import { useRepost } from '@/features/repost/useRepost';
import { useStory } from '@/features/story/useStory';
import { useAdmin } from '@/features/admin/useAdmin';
```

### Use All Hooks in One Component
```tsx
export function MyComponent() {
  const hashtag = useHashtag();
  const repost = useRepost();
  const story = useStory();
  const admin = useAdmin();

  // Use them...
}
```

---

## Common Patterns

### Load Data on Mount
```tsx
useEffect(() => {
  getFollowingStories();
  getAllHashtags();
}, []);
```

### Handle Errors
```tsx
const { error, loading } = useStory();

if (error) return <div className="error">{error}</div>;
if (loading) return <div>Loading...</div>;
```

### Update UI After Action
```tsx
const handleDelete = async (id) => {
  await deleteStory(id);
  await getFollowingStories(); // Refresh
};
```

---

For more details, refer to `NEW_FEATURES.md`.
