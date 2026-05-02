import React, { useEffect, useState } from "react";
import { useAdmin } from "../useAdmin";
import { updateProfileAPI } from "../../../features/profile/api";
import TableWrapper from "../components/TableWrapper";
import DeleteBtn from "../components/DeleteBtn";
import CreateUserModal from "./CreateUserModal";
import ImageUpload from "../../../shared/components/ImageUpload"; // Component upload ảnh chung

export default function UserPage() {
  const { getAllUsers, deleteUser } = useAdmin();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [form, setForm] = useState({
    username: "",
    bio: "",
    avatarUrl: "",
  });

  // ================= LOAD USERS =================
  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setData(Array.isArray(res) ? res : res?.users || []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ================= EDIT USER =================
  const openEdit = (user: any) => {
    setEditingUser(user);
    setForm({
      username: user.username || "",
      bio: user.bio || "",
      avatarUrl: user.avatarUrl || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingUser) return;

    await updateProfileAPI(editingUser.id, form);
    setEditingUser(null);
    load();
  };

  // ================= DELETE USER =================
  const handleDelete = async (id: string) => {
    if (!window.confirm("Xóa user này?")) return;

    await deleteUser(id);
    load();
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-400">
          Quản lý người dùng
        </h2>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-200"
        >
          + Thêm User
        </button>
      </div>

      {/* TABLE */}
      <TableWrapper loading={loading}>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Posts</th>
            <th className="text-right">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="text-center py-6 text-gray-500"
              >
                Không có user
              </td>
            </tr>
          ) : (
            data.map((u) => (
              <tr key={u.id}>
                {/* USER + AVATAR */}
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs flex items-center justify-center h-full text-gray-400">
                          {u.username?.[0]}
                        </span>
                      )}
                    </div>

                    <span>{u.username}</span>
                  </div>
                </td>

                <td>{u.email}</td>
                <td>{u.postsCount || 0}</td>

                {/* ACTION */}
                <td className="text-right space-x-3">
                  <button
                    onClick={() => openEdit(u)}
                    className="text-blue-400 text-xs hover:text-blue-300"
                  >
                    Edit
                  </button>

                  <DeleteBtn onClick={() => handleDelete(u.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </TableWrapper>

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={load}
        />
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-xl w-96 space-y-4 border border-gray-800">
            <h3 className="text-lg font-bold">Edit User</h3>

            {/* AVATAR UPLOAD */}
            <ImageUpload
              value={form.avatarUrl}
              onChange={(url) =>
                setForm({ ...form, avatarUrl: url })
              }
            />

            {/* USERNAME */}
            <input
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="w-full bg-black border border-gray-700 px-3 py-2 rounded"
              placeholder="Username"
            />

            {/* BIO */}
            <textarea
              value={form.bio}
              onChange={(e) =>
                setForm({ ...form, bio: e.target.value })
              }
              className="w-full bg-black border border-gray-700 px-3 py-2 rounded"
              placeholder="Bio"
            />

            {/* ACTION */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-3 py-1 text-gray-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-white text-black px-4 py-1 rounded font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}