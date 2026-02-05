import { useState } from "react";
import { useRouter } from "next/router";
import axiosClient from "../services/axiosClient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      await axiosClient.post("/auth/login", { email, password });

      // ✅ Cookie is now set
      router.replace("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 sm:p-12 rounded-xl w-full max-w-md">
        {/* CryptoNest Branding */}
        <h1 className="text-green-400 text-3xl sm:text-4xl font-bold text-center mb-2">
          CryptoNest
        </h1>
        <p className="text-gray-400 text-center text-sm sm:text-base mb-6">
          Secure Investment Platform
        </p>

        {/* Email Input */}
        <input
          className="w-full mb-4 px-4 py-3 bg-black border border-gray-700 rounded text-white text-sm sm:text-base focus:outline-none focus:border-green-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <input
          type="password"
          className="w-full mb-4 px-4 py-3 bg-black border border-gray-700 rounded text-white text-sm sm:text-base focus:outline-none focus:border-green-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-black py-3 rounded font-semibold text-sm sm:text-base disabled:opacity-50 transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4 text-center text-sm sm:text-base">{error}</p>}
      </div>
    </div>
  );
}