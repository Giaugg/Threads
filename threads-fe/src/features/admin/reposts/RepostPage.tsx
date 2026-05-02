import React, { useEffect, useState } from "react";
import { useAdmin } from "../useAdmin";
import TableWrapper from "../components/TableWrapper";

export default function RepostPage() {
  const { getAllReposts } = useAdmin();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getAllReposts().then(setData);
  }, []);

  return (
    <TableWrapper>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={999} className="text-center text-gray-400 py-6">
              No data found
            </td>
          </tr>
        ) : (
          data.map((r) => (
            <tr key={r.id}>
              <td>{r.user.username}</td>
            </tr>
          ))
        )}
      </tbody>
    </TableWrapper>
  );
}