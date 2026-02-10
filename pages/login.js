import { useState } from "react";
import { useRouter } from "next/router";
import axiosClient from "../services/axiosClient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      // 🔑 FIX: no /api here
      await axiosClient.post("/auth/login", {
        email,
        password
      });

      // cookie is set by backend
      router.replace("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 sm:p-12 rounded-xl w-full max-w-md"
      >
        <h1 className="text-green-400 text-3xl font-bold text-center mb-2">
          CryptoNest
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 bg-black border border-gray-700 rounded text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 bg-black border border-gray-700 rounded text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-black py-3 rounded font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
