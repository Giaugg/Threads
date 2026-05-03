import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import {
  getUserProfileAPI,
  updateProfileAPI,
  getUserPostsAPI,
  getUserRepliesAPI,
  getUserMediaAPI,
  checkFollowAPI,
  followAPI,
  unfollowAPI,
  getUserRepostsAPI,
} from "../features/profile/api";

import PostCard from "../features/post/PostCard";
import MainLayout from "../shared/layout/MainLayout";
import ImageUpload from "../shared/components/ImageUpload";

export default function ProfilePage() {
  const { user: currentUser } = useAuth();
  const { id } = useParams<{ id: string }>();
  const profileUserId = id || currentUser?.id;
  const isOwnProfile = profileUserId === currentUser?.id;

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [replies, setReplies] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [reposts, setReposts] = useState<any[]>([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [tab, setTab] = useState("posts");
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    username: "",
    bio: "",
    avatarUrl: "",
  });

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    const res = await getUserProfileAPI(profileUserId!);
    setProfile(res.data);
    console.log("Fetched profile:", profileUserId);

    setForm({
      username: res.data.user.username,
      bio: res.data.user.bio || "",
      avatarUrl: res.data.user.avatarUrl || "",
    });
  };

  // ================= FETCH DATA =================
  const fetchAllData = async () => {
    const [p, r, m, rp] = await Promise.all([
      getUserPostsAPI(profileUserId!),
      getUserRepliesAPI(profileUserId!),
      getUserMediaAPI(profileUserId!),
      getUserRepostsAPI(profileUserId!),
    ]);
    
    const repostsData = rp.data.map((item: any) => item.originalPost);

    setPosts(p.data);
    setReplies(r.data);
    setMedia(m.data);
    setReposts(repostsData);
    console.log("Fetched reposts:", repostsData);
  };

  // ================= CHECK FOLLOW =================
  const fetchFollow = async () => {
    if (isOwnProfile) return;

    const res = await checkFollowAPI(profileUserId!);
    setIsFollowing(res.data.isFollowing);
  };

  useEffect(() => {
    if (!profileUserId) return;

    fetchProfile();
    fetchAllData();
    fetchFollow();
  }, [profileUserId]);

  // ================= UPDATE PROFILE =================
  const handleUpdate = async () => {
    const res = await updateProfileAPI(profileUserId!, form);
    setProfile((prev: any) => ({ ...prev, user: res.data }));
    setEditing(false);
  };

  // ================= FOLLOW ACTION =================
  const handleFollow = async () => {
    if (isFollowing) {
      await unfollowAPI(profileUserId!);
      setIsFollowing(false);
    } else {
      await followAPI(profileUserId!);
      setIsFollowing(true);
    }
  };

  if (!profile) return null;

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto">

        {/* HEADER */}
        <div className="p-4 border-b border-threadBorder">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {profile.user.username}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                {profile.user.bio}
              </p>

              <div className="flex gap-4 text-sm text-gray-400 mt-2">
                <span>{profile.followers} followers</span>
                <span>{profile.following} following</span>
              </div>
            </div>

            {/* Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
              {profile.user.avatarUrl ? (
                <img
                  src={profile.user.avatarUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {profile.user.username?.[0]}
                </span>
              )}
            </div>
          </div>

          {/* BUTTON */}
          {isOwnProfile ? (
            <button
              onClick={() => setEditing(!editing)}
              className="mt-3 w-full border border-gray-600 py-2 rounded-full hover:bg-white/10"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className={`mt-3 w-full py-2 rounded-full font-semibold ${
                isFollowing
                  ? "border border-gray-600 hover:bg-white/10"
                  : "bg-white text-black"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* EDIT */}
        {editing && isOwnProfile && (
          <div className="p-4 border-b border-threadBorder space-y-3">
            <input
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="w-full bg-black border border-gray-700 px-3 py-2 rounded"
              placeholder="Username"
            />

            <textarea
              value={form.bio}
              onChange={(e) =>
                setForm({ ...form, bio: e.target.value })
              }
              className="w-full bg-black border border-gray-700 px-3 py-2 rounded"
              placeholder="Bio"
            />

            <ImageUpload
              value={form.avatarUrl}
              onChange={(url) =>
                setForm({ ...form, avatarUrl: url })
              }
            />

            <button
              onClick={handleUpdate}
              className="bg-white text-black px-4 py-1 rounded-full"
            >
              Save
            </button>
          </div>
        )}

        {/* TABS */}
        <div className="flex border-b border-threadBorder text-sm">
          {[
            { key: "posts", label: "Threads" },
            { key: "replies", label: "Replies" },
            { key: "media", label: "Media" },
            { key: "reposts", label: "Reposts" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-3 ${
                tab === t.key
                  ? "border-b-2 border-white font-semibold"
                  : "text-gray-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div>

          {/* POSTS */}
          {tab === "posts" &&
            posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}

          {/* REPLIES */}
          {tab === "replies" &&
            replies.map((r) => (
              <div key={r.id} className="p-4 border-b border-threadBorder">
                <p className="text-sm text-gray-300">{r.content}</p>
              </div>
            ))}

          {/* MEDIA */}
          {tab === "media" && (
            <div className="grid grid-cols-3 gap-1">
              {media.map((m) => (
                <img
                  key={m.id}
                  src={m.imageUrl}
                  className="w-full h-32 object-cover"
                />
              ))}
            </div>
          )}

          {/* REPOSTS */}
          {tab === "reposts" && (
            <div>
              {reposts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}