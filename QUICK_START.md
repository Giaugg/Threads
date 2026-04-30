## 🚀 Image Upload System - Quick Start

### What's Included?

✅ **Backend (Server - C#/.NET)**
- `FilesController.cs` - Image upload/delete endpoints
- `Program.cs` - Static files middleware configuration
- Security validations (file type, size, path traversal)

✅ **Frontend (Client - React/TypeScript)**
- `ImageUpload.tsx` - Reusable profile image component
- `PostImageUpload.tsx` - Post-specific image component
- `PostCreate.tsx` - Enhanced with image upload
- `ProfilePage.tsx` - Enhanced with image upload
- `useImageUpload.ts` - Custom hook for image handling
- `api.ts` files - API integrations

### How It Works

#### 1️⃣ Upload Flow
```
User selects image
    ↓
Client validates (type, size)
    ↓
POST /api/files/upload (with FormData)
    ↓
Server validates & saves to wwwroot/uploads/
    ↓
Server returns: { url: "http://..../uploads/[uuid].jpg" }
    ↓
Client stores URL in post/profile
    ↓
POST /api/posts or PUT /api/users/{id}
    ↓
Image displayed to users
```

#### 2️⃣ Display Flow
```
Server hosts files in wwwroot/uploads/
    ↓
Files accessible via HTTP: /uploads/[filename]
    ↓
Image component renders with URL
    ↓
Browser displays image
```

### Quick Usage

#### Upload Avatar (Profile)
```tsx
import ImageUpload from "@/shared/components/ImageUpload";

<ImageUpload
  value={form.avatarUrl}
  onChange={(url) => setForm({ ...form, avatarUrl: url })}
  label="Upload Profile Picture"
/>
```

#### Upload Post Image
```tsx
import PostImageUpload from "@/shared/components/PostImageUpload";

<PostImageUpload
  onImageSelect={(file, preview) => {
    setImageFile(file);
    setPreviewUrl(preview);
  }}
  onRemove={() => {
    setImageFile(null);
    setPreviewUrl(null);
  }}
  previewUrl={previewUrl}
  isLoading={loading}
/>
```

#### Use Hook
```tsx
import { useImageUpload } from "@/core/hooks/useImageUpload";

const { uploading, error, uploadImage } = useImageUpload();

const url = await uploadImage(file);
if (url) {
  // Use the URL
}
```

### File Structure
```
Threads.API/
├── Controllers/
│   └── FilesController.cs          ✨ Upload/delete endpoints
├── wwwroot/
│   └── uploads/                    📁 Image storage
└── Program.cs                       ✨ Static files config

threads-fe/
├── src/
│   ├── features/
│   │   ├── post/
│   │   │   ├── PostCreate.tsx       ✨ Enhanced
│   │   │   └── api.ts
│   │   ├── profile/
│   │   │   ├── ProfilePage.tsx      ✨ Enhanced
│   │   │   └── api.ts
│   │   └── file/
│   │       └── api.ts              ✨ Fixed path
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ImageUpload.tsx      ✨ New
│   │   │   └── PostImageUpload.tsx  ✨ New
│   │   └── layout/
│   └── core/
│       └── hooks/
│           └── useImageUpload.ts    ✨ New
```

### Configuration

**Server (Program.cs)**
- Auto-creates wwwroot/uploads/ directory
- Serves static files from wwwroot/
- CORS enabled for image access

**Client (api.js)**
- Base URL: http://localhost:5064/api
- Auto-includes JWT token

### Validations

**Client-side:**
- File type check (must be image)
- File size check (max 5MB)
- User feedback with error messages

**Server-side:**
- File type validation (allowed extensions)
- File size validation (5MB limit)
- Path traversal protection
- Secure file operations

### API Endpoints

**Upload**
```
POST /api/files/upload
- Form-Data with "file" field
- Returns: { url, fileName }
```

**Delete**
```
DELETE /api/files/{fileName}
- Secure filename validation
- Returns: { message }
```

**Create Post with Image**
```
POST /api/posts
- { content, imageUrl }
```

**Update User Avatar**
```
PUT /api/users/{userId}
- { username, avatarUrl, bio }
```

### Testing

1. **Start Backend:**
   ```bash
   cd Threads.API
   dotnet run
   ```

2. **Start Frontend:**
   ```bash
   cd threads-fe
   npm run dev
   ```

3. **Test Upload:**
   - Go to Profile page
   - Click "Edit Profile"
   - Upload avatar image
   - See preview → Save
   - Avatar displays

4. **Test Post Image:**
   - Create new post
   - Click "Add image"
   - Select image file
   - See preview → Post
   - Image displays in feed

### Debugging

**Images not showing?**
1. Check browser Network tab
2. Verify image URL is correct
3. Check server logs for errors
4. Ensure wwwroot/uploads/ exists

**Upload failing?**
1. Check file size (max 5MB)
2. Check file type (must be image)
3. Check server console for errors
4. Verify network connection

### Next Steps

1. Test the system end-to-end
2. Add image compression (optional)
3. Add drag-and-drop support (optional)
4. Add multiple image upload (optional)
5. Integrate with CDN (future)

### Support Files

- **Full Documentation:** See `IMAGE_UPLOAD_GUIDE.md`
- **API Reference:** See API Endpoints section in guide
- **Component Props:** Check JSDoc comments in components
