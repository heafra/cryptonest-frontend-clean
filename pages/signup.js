import { useState } from "react";
import { useRouter } from "next/router";
import axiosClient from "../services/axiosClient";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      // 1️⃣ Signup
      await axiosClient.post("/auth/signup", { email, password });

      // 2️⃣ Auto-login
      const res = await axiosClient.post("/auth/login", { email, password });

      // ✅ Store JWT in localStorage
      localStorage.setItem("token", res.data.token);

      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSignup} className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-500 text-black rounded font-semibold hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}