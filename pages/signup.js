import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axiosClient from "../services/axiosClient";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axiosClient.post("/auth/signup", {
        email,
        password,
      });

      // Save user to local storage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to dashboard
      router.replace("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        onSubmit={handleSignup}
        className="bg-gray-900 p-8 sm:p-12 rounded-xl w-full max-w-md"
      >
        <h1 className="text-green-400 text-3xl font-bold text-center mb-2">
          CryptoNest
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Create your account
        </p>

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 bg-black border border-gray-700 rounded text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-black py-3 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}

        {/* Login redirect */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-500 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}