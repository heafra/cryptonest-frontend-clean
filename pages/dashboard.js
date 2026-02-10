import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosClient from "../services/axiosClient";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 AUTH CHECK
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosClient.get("/auth/me");
        if (!res.data.user) throw new Error("No auth");
        setUser(res.data.user);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await axiosClient.post("/auth/logout");
    router.replace("/login");
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white px-6">
      <nav className="flex justify-between items-center py-4 border-b border-gray-800">
        <h1 className="text-green-400 text-xl font-bold">
          CryptoNest
        </h1>
        <button onClick={handleLogout} className="text-gray-400">
          Logout
        </button>
      </nav>

      <main className="mt-8">
        <h2 className="text-2xl mb-2">
          Welcome, {user.email}
        </h2>
        <p className="text-gray-400">
          Your dashboard is now protected by cookies 🔐
        </p>
      </main>
    </div>
  );
}