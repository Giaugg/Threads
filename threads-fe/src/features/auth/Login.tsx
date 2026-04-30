import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    await login(form);
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[350px] space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          className="w-full p-3 bg-[#121212] border border-threadBorder rounded-lg"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full p-3 bg-[#121212] border border-threadBorder rounded-lg"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleLogin}
          className="w-full bg-white text-black py-2 rounded-lg font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}