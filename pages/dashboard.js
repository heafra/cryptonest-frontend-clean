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

  const BTC_ADDRESS = "bc1qf5gz0g0mdjz0a5c84r2qjnhcvqsnnvp046g2cf";
  const BANK_DETAILS = `
Routing number: 121146177
Swift code: CLNOU59
Bank address: 1 Letterman Dr, San Francisco, CA 23451
Account #: 692101393999
Full name: Trewin Trades LLC
  `;

  useEffect(() => {
    const load = async () => {
      try {
        // ✅ Send token via Authorization header (handled by axiosClient)
        const res = await axiosClient.get(`${process.env.NEXT_PUBLIC_API_URL}/portfolio`);
        setBalance(Number(res.data.balance) || 0);
        setInvested(Number(res.data.invested || 0));
      } catch (err) {
        router.replace("/login");
      }
    };
    load();
  }, []);

  const closeModal = () => {
    setModal(null);
    setAmount("");
    setDepositMethod(null);
    setCopied(false);
  };

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
          onClick={() => {
            localStorage.removeItem("token"); // ✅ remove token on logout
            router.replace("/login");
          }}
          className="text-gray-400 hover:text-white text-sm sm:text-base"
        >
          Logout
        </button>
      </nav>

      {/* MAIN */}
      {/* ... keep your portfolio, modal, actions UI unchanged ... */}
    </div>
  );
}