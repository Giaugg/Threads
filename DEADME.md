run project: `dotnet run`
run migration: `dotnet ef migrations add InitialCreate`


* [ ] xem cac bai post, tao post, tim post, repost
* [ ] comment, show comment, comment reply  
* [ ] search user, search post
* [ ] profile


Cau truc du an FE
src/
├── main.tsx
├── App.tsx
├── index.css

├── lib/
│   └── api.ts

├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   │
│   ├── post/
│   │   ├── PostCard.tsx
│   │   └── CreatePost.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       └── Input.tsx

├── features/
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   ├── auth.api.ts
│   │   └── pages/
│   │       ├── LoginPage.tsx
│   │       └── RegisterPage.tsx
│   │
│   ├── post/
│   │   ├── post.api.ts
│   │   └── hooks/
│   │       └── usePosts.ts
│   │
│   └── feed/
│       └── pages/
│           └── FeedPage.tsx

├── pages/
│   ├── ProfilePage.tsx
│   └── SearchPage.tsx

└── routes/
    └── AppRoutes.tsx