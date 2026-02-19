import React, { useState } from "react";
import {
  FiPercent,
  FiPlay,
  FiRefreshCw,
  FiCalendar,
  FiInfo,
  FiCheckCircle,
  FiUsers,
  FiActivity,
} from "react-icons/fi";

const InterestPosting = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rate, setRate] = useState(5.5);

  const stats = [
    {
      label: "Eligible Members",
      value: "1,234",
      icon: <FiUsers className="text-blue-500" />,
    },
    {
      label: "Total Savings Vol.",
      value: "₦12,850,500",
      icon: <FiActivity className="text-green-500" />,
    },
    {
      label: "Est. Distribution",
      value: `₦${(12850500 * (rate / 100)).toLocaleString()}`,
      icon: <FiPercent className="text-amber-500" />,
    },
  ];

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("Interest posted successfully to 1,234 members!");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Interest & Dividend Posting
        </h1>
        <p className="text-slate-600">
          Calculate and distribute annual dividends or monthly interest to all
          active members.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-xl">
              {stat.icon}
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              {stat.label}
            </p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">
              Posting Configuration
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Interest Calculation Rate (%)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xl font-black text-blue-600 w-16 text-right">
                  {rate}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Distribution Period
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -track-y-1/2 text-slate-400" />
                <select className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-700">
                  <option>Annual Dividend - FY 2024</option>
                  <option>Monthly Interest - Feb 2024</option>
                  <option>Special Distribution</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-start space-x-3 text-slate-600">
              <FiInfo className="mt-1 flex-shrink-0 text-blue-500" />
              <p className="text-xs leading-relaxed italic">
                Postings are final once processed. Ensure the Trial Balance
                matches the cooperative's bank statement before initiating this
                action. All member accounts will be updated simultaneously.
              </p>
            </div>

            <div className="pt-6">
              <label className="flex items-center cursor-pointer group mb-6">
                <input
                  type="checkbox"
                  className="w-5 h-5 border-slate-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                  I confirm all accounts are balanced
                </span>
              </label>

              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-black transition-all shadow-xl ${
                  isProcessing
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:scale-[1.02]"
                }`}
              >
                {isProcessing ? (
                  <FiRefreshCw className="animate-spin text-xl" />
                ) : (
                  <>
                    <FiPlay />
                    <span>Post Interest Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">
            Recent Posting Logs
          </h4>
          <div className="space-y-3">
            {[
              {
                date: "Jan 01, 2024",
                type: "Annual Dividend",
                rate: "12%",
                total: "₦1,420,000",
                status: "Completed",
              },
              {
                date: "Dec 01, 2023",
                type: "Special Posting",
                rate: "2%",
                total: "₦250,500",
                status: "Completed",
              },
            ].map((log, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                    <FiCheckCircle />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">
                      {log.type}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {log.date} • {log.rate} Rate
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">
                    {log.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestPosting;
