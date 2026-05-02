import React, { useEffect } from "react";
import { useAdmin } from "./useAdmin";

export const AdminDashboard = () => {
  const { getStats } = useAdmin();
  const [statistics, setStatistics] = React.useState<any>(null);

  useEffect(() => {
    // Đảm bảo lấy đúng dữ liệu
    const fetchStats = async () => {
      const data = await getStats();
      setStatistics(data);
    };
    fetchStats();
  }, []);

  if (!statistics) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(statistics).map(([k, v]) => {
        // Kiểm tra nếu v là object thì không render để tránh crash
        if (typeof v === 'object') return null; 

        return (
          <div key={k} className="bg-[#111] p-4 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm uppercase">{k}</p>
            <p className="text-2xl font-bold">{String(v)}</p>
          </div>
        );
      })}
    </div>
  );
};