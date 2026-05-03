import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "../features/feed/Feed";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import ProfilePage from "../pages/ProfilePage";
import ActivityPage from "../pages/ActivityPage";

import { AdminLayout } from "../pages/AdminLayout";
import { AdminDashboard } from "../features/admin/AdminDashboard";

import UserPage from "../features/admin/users/UserPage";
import PostPage from "../features/admin/posts/PostPage";
import StoryPage from "../features/admin/stories/StoryPage";
import HashtagPage from "../features/admin/hashtags/HashtagPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Feed />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/profile/:id?" element={<ProfilePage />} />
        </Route>
        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminLayout />}>

            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserPage />} />
            <Route path="posts" element={<PostPage />} />
            <Route path="stories" element={<StoryPage />} />
            <Route path="hashtags" element={<HashtagPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}