// Dashboard.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Line } from "react-chartjs-2";
import axiosClient from "../services/axiosClient";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

export default function Dashboard() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [invested, setInvested] = useState(0);
  const [amount, setAmount] = useState("");
  const [modal, setModal] = useState(null);
  const [depositMethod, setDepositMethod] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const BTC_ADDRESS = "bc1qf5gz0g0mdjz0a5c84r2qjnhcvqsnnvp046g2cf";
  const BANK_DETAILS = `
Routing number: 121146177
Swift code: CLNOU59
Bank address: 1 Letterman Dr, San Francisco, CA 23451
Account #: 692101393999
Full name: Trewin Trades LLC
  `;

  // Load portfolio from backend
  useEffect(() => {
    const loadPortfolio = async () => {
      const user = localStorage.getItem("user");
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        setLoading(true);
        const res = await axiosClient.get("/portfolio"); // HTTP-only cookie is sent automatically
        setBalance(Number(res.data.balance) || 0);
        setInvested(Number(res.data.invested) || 0);
      } catch (err) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };
    loadPortfolio();
  }, [router]);

  // Logout user
  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout"); // clears cookie
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("user");
      router.replace("/login");
    }
  };

  // Close modals
  const closeModal = () => {
    setModal(null);
    setAmount("");
    setDepositMethod(null);
    setCopied(false);
  };

  // Confirm investment
  const confirmInvest = () => {
    const value = Number(amount);
    if (!value || value <= 0 || value > balance) return;
    setBalance(balance - value);
    setInvested(invested + value);
    closeModal();
  };

  const chartData = {
    labels: Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        data: [980, 990, 1002, 998, 1010, 1025, 1030, 1028, 1040, 1055, 1060, 1072, 1085, 1100],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.15)",
        fill: true,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-8">
      {/* NAV */}
      <nav className="flex justify-between items-center py-4 border-b border-gray-800 max-w-6xl mx-auto">
        <h1 className="text-green-400 font-bold text-xl sm:text-2xl">CryptoNest</h1>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-white text-sm sm:text-base"
        >
          Logout
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto py-8">
        <h2 className="text-2xl mb-4">Portfolio</h2>

        {loading ? (
          <p>Loading portfolio...</p>
        ) : (
          <>
            <p>Balance: ${balance}</p>
            <p>Invested: ${invested}</p>

            {/* Chart */}
            <div className="mt-6">
              <Line data={chartData} />
            </div>

            {/* Example modal buttons (deposit/invest) */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setModal("deposit")}
                className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600"
              >
                Deposit
              </button>
              <button
                onClick={() => setModal("invest")}
                className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600"
              >
                Invest
              </button>
            </div>

            {/* Modal (simplified) */}
            {modal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
                  <h3 className="text-lg font-bold mb-4">{modal === "deposit" ? "Deposit" : "Invest"}</h3>

                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full mb-4 px-3 py-2 rounded bg-black border border-gray-700 text-white"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    {modal === "invest" && (
                      <button
                        onClick={confirmInvest}
                        className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                      >
                        Confirm
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}



