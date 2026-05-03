import React, { useEffect, useState } from "react";
import { useAdmin } from "../useAdmin";
import TableWrapper from "../components/TableWrapper";
import DeleteBtn from "../components/DeleteBtn";
import CreatePostModal from "./reatePostModal"; // Import modal tạo post
import EditPostModal from "./EditPostModal"; // Import modal chỉnh sửa post

export default function PostPage() {
  const { getAllPosts, deletePost } = useAdmin();

  const [data, setData] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [edit, setEdit] = useState<any>(null);

  const load = async () => {
    setData(await getAllPosts());
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <TableWrapper>
        <thead>
          <tr>
            <th>Content</th>
            <th>User</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.id}>
              <td>{p.content}</td>
              <td>{p.user?.username}</td>
              <td className="flex gap-2">
                <button onClick={() => setEdit(p)}>Edit</button>
                <DeleteBtn
                  onClick={async () => {
                    confirm("Are you sure?") &&
                    await deletePost(p.id);
                    load();
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>

      {showCreate && (
        <CreatePostModal
          onClose={() => setShowCreate(false)}
          onSuccess={load}
        />
      )}

      {edit && (
        <EditPostModal
          post={edit}
          onClose={() => setEdit(null)}
          onSuccess={load}
        />
      )}
    </>
  );
}