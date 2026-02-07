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

      const res = await axiosClient.post("/auth/login", { email, password });

      // ✅ Store JWT in localStorage
      localStorage.setItem("token", res.data.token);

      router.replace("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form onSubmit={handleLogin} className="bg-gray-900 p-8 sm:p-12 rounded-xl w-full max-w-md">
        <h1 className="text-green-400 text-3xl sm:text-4xl font-bold text-center mb-2">CryptoNest</h1>
        <p className="text-gray-400 text-center text-sm sm:text-base mb-6">Secure Investment Platform</p>

        <input
          className="w-full mb-4 px-4 py-3 bg-black border border-gray-700 rounded text-white text-sm sm:text-base focus:outline-none focus:border-green-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full mb-4 px-4 py-3 bg-black border border-gray-700 rounded text-white text-sm sm:text-base focus:outline-none focus:border-green-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-black py-3 rounded font-semibold text-sm sm:text-base disabled:opacity-50 transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-500 mt-4 text-center text-sm sm:text-base">{error}</p>}

        <p className="mt-4 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-green-500 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}
