import { useState } from "react";

import { useRouter } from "next/router";

import axiosClient from "../services/axiosClient";



export default function Signup() {

  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);



  const handleSignup = async () => {

    try {

      setLoading(true);

      setError("");



      // Call backend signup endpoint

      const res = await axiosClient.post("/auth/signup", { email, password });



      // ✅ Cookie is already set by backend, no need to store token

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

      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">

        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>



        <input

          type="email"

          placeholder="Email"

          value={email}

          onChange={e => setEmail(e.target.value)}

          className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700 text-white"

        />



        <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={e => setPassword(e.target.value)}

          className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700 text-white"

        />



        {error && <p className="text-red-500 mb-3">{error}</p>}



        <button

          onClick={handleSignup}

          disabled={loading}

          className="w-full py-2 bg-green-500 text-black rounded font-semibold hover:bg-green-600 disabled:opacity-50"

        >

          {loading ? "Signing up..." : "Sign Up"}

        </button>

      </div>

    </div>

  );

}



