# 📸 Image Upload System Documentation

## Overview
Complete image upload, storage, and retrieval system for the Threads application.

## Features

### ✅ Upload
- Client uploads images to server
- Server validates file type and size (max 5MB)
- Unique filename generation (UUID + extension)
- Secure storage in `wwwroot/uploads/`

### ✅ Storage & Access
- Images stored on server file system
- Public URL generated for client retrieval
- Static files served via HTTP
- Direct browser access: `http://localhost:5064/uploads/[filename]`

### ✅ Edit/Update
- Replace images in posts
- Update user avatar
- Remove/delete images
- Preview before save

### ✅ Display
- Images displayed in posts
- Avatar shown in profiles
- Responsive image rendering

## Architecture

### Backend (.NET/C#)

#### FilesController (`Controllers/FilesController.cs`)
```csharp
POST /api/files/upload
- Accept: IFormFile
- Validate: type, size
- Save: wwwroot/uploads/
- Return: { url, fileName }

DELETE /api/files/{fileName}
- Secure path validation
- File deletion
```

#### Static Files Middleware (`Program.cs`)
```csharp
// Auto-creates directories
// Serves files from wwwroot/
// Accessible via /uploads/{fileName}
```

### Frontend (React/TypeScript)

#### Components

1. **ImageUpload** (`shared/components/ImageUpload.tsx`)
   - Standalone image upload component
   - Preview existing image
   - Replace or remove
   - Used for: profiles, avatars

2. **PostImageUpload** (`shared/components/PostImageUpload.tsx`)
   - Image upload for posts
   - Inline editing
   - Preview before posting
   - Used for: creating posts

3. **PostCreate** (`features/post/PostCreate.tsx`)
   - Post creation with image support
   - Image upload integration
   - Error handling

4. **ProfilePage** (`features/profile/ProfilePage.tsx`)
   - User profile editing
   - Avatar upload via ImageUpload component
   - Profile information update

#### Hooks

**useImageUpload** (`core/hooks/useImageUpload.ts`)
```typescript
const { uploading, error, uploadImage, clearError } = useImageUpload();

// Usage
const imageUrl = await uploadImage(file);
```

#### APIs

**Post API** (`features/post/api.ts`)
```typescript
uploadImageAPI(file: File)
- POST /files/upload
- FormData with file
- Return: { url: string }

createPostAPI(data: CreatePostDto)
- POST /posts
- Include imageUrl if present
```

**File API** (`features/file/api.ts`)
```typescript
uploadFileAPI(file: File)
- Alias for uploadImageAPI
- Centralized file upload

deleteFileAPI(fileName: string)
- DELETE /files/{fileName}
```

## Usage Examples

### 1. Upload Image (Profile)
```typescript
import ImageUpload from "@/shared/components/ImageUpload";

<ImageUpload
  value={avatarUrl}
  onChange={(url) => setAvatarUrl(url)}
  label="Upload Profile Picture"
/>
```

### 2. Upload Image (Post)
```typescript
import PostImageUpload from "@/shared/components/PostImageUpload";

<PostImageUpload
  onImageSelect={(file, previewUrl) => {
    setImageFile(file);
    setPreviewUrl(previewUrl);
  }}
  onRemove={() => {
    setImageFile(null);
    setPreviewUrl(null);
  }}
  previewUrl={previewUrl}
  isLoading={loading}
/>
```

### 3. Using Hook
```typescript
import { useImageUpload } from "@/core/hooks/useImageUpload";

const { uploading, error, uploadImage } = useImageUpload();

const handleUpload = async (file: File) => {
  const url = await uploadImage(file);
  if (url) {
    // Use the URL
    console.log("Uploaded to:", url);
  }
};
```

## File Flow

### Post with Image
```
1. User selects image → PostImageUpload
2. Frontend uploads via uploadImageAPI
3. Server validates & saves to wwwroot/uploads/
4. Server returns URL: http://localhost:5064/uploads/[guid].jpg
5. Frontend stores URL in post
6. User creates post with imageUrl
7. Post displayed with image via PostCard
```

### User Avatar
```
1. User clicks "Edit Profile" → ProfilePage
2. Use ImageUpload component
3. Upload via uploadImageAPI
4. Server saves to wwwroot/uploads/
5. Frontend gets URL
6. Update user via updateProfileAPI with avatarUrl
7. Avatar displays in profile & posts
```

## File Specifications

### Allowed Types
- `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`

### Size Limits
- Max 5MB per file
- Validated on client and server

### Storage
- Location: `wwwroot/uploads/`
- Naming: `{UUID}{extension}` (e.g., `f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg`)
- Permissions: Read by all, delete by API

### Public URL Format
```
http://localhost:5064/uploads/{fileName}
```

## Security Considerations

1. **File Type Validation**
   - Client-side: Check MIME type
   - Server-side: Verify extension in whitelist

2. **Size Validation**
   - Client-side: Check file.size
   - Server-side: Enforce 5MB limit

3. **Path Traversal Protection**
   - Server validates file path
   - Ensures file is in uploads folder only
   - Prevents directory traversal attacks

4. **Delete Endpoint Security**
   - Only API can delete files
   - Not accessible via direct URL
   - Requires valid filename

5. **CORS Configuration**
   - Allows image access from frontend
   - Configured in Program.cs

## API Reference

### Upload Image
```http
POST /api/files/upload
Content-Type: multipart/form-data

file: [binary image data]

Response (200):
{
  "url": "http://localhost:5064/uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg",
  "fileName": "f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg"
}

Response (400):
{
  "message": "File size must not exceed 5MB."
}
```

### Delete Image
```http
DELETE /api/files/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg

Response (200):
{
  "message": "File deleted successfully."
}
```

### Create Post with Image
```http
POST /api/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Check out this image!",
  "imageUrl": "http://localhost:5064/uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg"
}

Response (200):
{
  "id": "...",
  "content": "Check out this image!",
  "imageUrl": "http://localhost:5064/uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg",
  "user": {...},
  "createdAt": "2026-05-01T00:00:00Z"
}
```

### Update User Avatar
```http
PUT /api/users/{userId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newusername",
  "avatarUrl": "http://localhost:5064/uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg",
  "bio": "My bio"
}

Response (200):
{
  "id": "...",
  "username": "newusername",
  "email": "user@example.com",
  "avatarUrl": "http://localhost:5064/uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg",
  "bio": "My bio"
}
```

## Troubleshooting

### Images Not Displaying
1. Check if server is running
2. Verify image URL format
3. Check browser console for errors
4. Ensure CORS is enabled

### Upload Failed
1. Check file size (max 5MB)
2. Check file type (image only)
3. Verify server uploads folder exists
4. Check file permissions

### Avatar Not Updating
1. Verify imageUrl is correct format
2. Check user update API response
3. Verify profile page refresh after update

## Performance Tips

1. **Compression**
   - Consider image compression before upload
   - Reduces bandwidth and storage

2. **Lazy Loading**
   - Use image lazy loading in feeds
   - Improves page performance

3. **CDN**
   - Future: Consider CDN for image serving
   - Improves load times

4. **Caching**
   - Browser caches images automatically
   - Set appropriate cache headers if needed

## Future Enhancements

- [ ] Image compression
- [ ] Thumbnail generation
- [ ] CDN integration
- [ ] Image optimization
- [ ] Drag-and-drop upload
- [ ] Multiple image upload
- [ ] Image editing tools
- [ ] Watermarking
- [ ] Image analytics
