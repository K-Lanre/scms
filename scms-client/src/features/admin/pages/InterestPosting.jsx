import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FiPercent,
  FiPlay,
  FiRefreshCw,
  FiCalendar,
  FiInfo,
  FiCheckCircle,
  FiUsers,
  FiActivity,
  FiEye,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";
import {
  getPostingStats,
  processPosting,
  getPostingHistory,
} from "../services/interestApi";
import toast from "react-hot-toast";
import { useConfirm } from "../../../contexts/ConfirmationContext";

const InterestPosting = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [rate, setRate] = useState(5.5);
  const [postingType, setPostingType] = useState("interest"); // 'interest' or 'dividend'
  const [period, setPeriod] = useState(
    `Monthly-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
  );
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [statsData, setStatsData] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);

  const [dryRunResult, setDryRunResult] = useState(null);
  const [showDryRunModal, setShowDryRunModal] = useState(false);

  const confirm = useConfirm();

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const data = await getPostingStats(postingType, rate);
      setStatsData(data);
    } catch (err) {
      toast.error("Failed to load posting statistics");
      console.error(err);
    } finally {
      setIsLoadingStats(false);
    }
  }, [postingType, rate]);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await getPostingHistory();
      setHistoryLogs(data.logs || []);
    } catch (err) {
      // toast.error("Failed to load posting history");
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    // Debounce stats fetching when rate changes
    const timer = setTimeout(() => {
      fetchStats();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchStats]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDryRun = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Executing Dry Run...");
    try {
      const data = await processPosting({
        type: postingType,
        period,
        rate,
        isDryRun: true,
      });
      setDryRunResult(data.data);
      setShowDryRunModal(true);
      toast.success("Dry Run completed", { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || "Dry Run failed", {
        id: toastId,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcess = async () => {
    if (!isConfirmed) {
      toast.error(
        "Please confirm all accounts are balanced before proceeding.",
      );
      return;
    }

    const confirmResult = await confirm({
      title: `Confirm ${postingType === "interest" ? "Interest" : "Dividend"} Posting`,
      message: `Are you sure you want to disburse ~${statsData?.estimatedDistribution || "0"} to ${statsData?.eligibleMembers || "0"} members? This operation CANNOT be easily undone.`,
      type: "danger",
    });

    if (!confirmResult) return;

    setIsProcessing(true);
    const toastId = toast.loading(
      `Processing ${postingType} posting... This may take a while.`,
    );

    try {
      await processPosting({
        type: postingType,
        period,
        rate,
        isDryRun: false,
      });
      toast.success(
        `${postingType === "interest" ? "Interest" : "Dividend"} posted successfully!`,
        { id: toastId, duration: 5000 },
      );
      setIsConfirmed(false);
      setDryRunResult(null);
      fetchStats();
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || "Posting failed", {
        id: toastId,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const stats = useMemo(
    () => [
      {
        label: "Eligible Members",
        value: isLoadingStats
          ? "..."
          : statsData?.eligibleMembers?.toLocaleString() || "0",
        icon: <FiUsers className="text-blue-500" />,
      },
      {
        label: `Total ${postingType === "interest" ? "Savings" : "Shares"} Vol.`,
        value: isLoadingStats ? "..." : `₦${statsData?.totalVolume || "0"}`,
        icon: <FiActivity className="text-green-500" />,
      },
      {
        label: "Est. Distribution",
        value: isLoadingStats
          ? "..."
          : `₦${statsData?.estimatedDistribution || "0"}`,
        icon: <FiPercent className="text-amber-500" />,
      },
    ],
    [statsData, isLoadingStats, postingType],
  );

  // Helper for predefined periods
  const handlePeriodChange = (e) => {
    const val = e.target.value;
    if (val === "custom") return; // let user type

    let pUrl = "";
    const now = new Date();
    if (val === "monthly_interest") {
      pUrl = `Monthly-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      setPostingType("interest");
      setRate(5.5); // Default interest
    } else if (val === "annual_dividend") {
      pUrl = `FY-${now.getFullYear()}`;
      setPostingType("dividend");
      setRate(12.0); // Default dividend
    }
    setPeriod(pUrl);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Interest & Dividend Posting
          </h1>
          <p className="text-slate-600">
            Calculate and distribute annual dividends or monthly interest to all
            active members.
          </p>
        </div>
        <button
          onClick={() => {
            fetchStats();
            fetchHistory();
          }}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
        >
          <FiRefreshCw className={isLoadingStats ? "animate-spin" : ""} />
        </button>
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
                Operation Type
              </label>
              <div className="relative">
                <select
                  onChange={handlePeriodChange}
                  className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-700 cursor-pointer"
                >
                  <option value="monthly_interest">
                    Monthly Interest (Savings)
                  </option>
                  <option value="annual_dividend">
                    Annual Dividend (Share Capital)
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Calculation Rate (%)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0.1"
                  max="20"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-20 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-black text-blue-600 text-center"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Period Identifier (Must be unique)
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -track-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-700"
                  placeholder="e.g., FY-2024 or Jan-2024"
                />
              </div>
            </div>

            <button
              onClick={handleDryRun}
              disabled={isProcessing || statsData?.eligibleMembers === 0}
              className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <FiEye />
              <span>Simulate Postings (Dry Run)</span>
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-between border border-slate-100">
            <div className="flex items-start space-x-3 text-slate-600 mb-6">
              <FiInfo className="mt-1 flex-shrink-0 text-blue-500" />
              <p className="text-xs leading-relaxed italic">
                Postings are final once processed. Ensure the Trial Balance
                matches the cooperative's bank statement before initiating this
                action. All{" "}
                {postingType === "interest" ? "savings" : "share capital"}{" "}
                accounts will be updated simultaneously.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <label className="flex items-center cursor-pointer group mb-6">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="w-5 h-5 border-slate-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-sm font-bold text-slate-700 group-hover:text-amber-700 transition-colors">
                  I confirm the rate and period are correct
                </span>
              </label>

              <button
                onClick={handleProcess}
                disabled={
                  isProcessing ||
                  !isConfirmed ||
                  statsData?.eligibleMembers === 0
                }
                className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-black transition-all shadow-xl ${
                  isProcessing ||
                  !isConfirmed ||
                  statsData?.eligibleMembers === 0
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:scale-[1.02]"
                }`}
              >
                {isProcessing ? (
                  <FiRefreshCw className="animate-spin text-xl" />
                ) : (
                  <>
                    <FiPlay />
                    <span>Commit Posting to Ledger</span>
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
            {isLoadingHistory ? (
              <div className="text-center py-4 text-slate-400 text-sm">
                Loading logs...
              </div>
            ) : historyLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No postings recorded yet.
              </div>
            ) : (
              historyLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        log.status === "completed"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {log.status === "completed" ? (
                        <FiCheckCircle />
                      ) : (
                        <FiAlertCircle />
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-800 capitalize">
                        {log.type} Posting
                      </h5>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        {new Date(log.createdAt).toLocaleDateString()} •{" "}
                        {log.period} • {log.rate}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">
                      ₦{Number(log.totalAmount).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {log.beneficiaryCount} Members
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dry Run Modal */}
      {showDryRunModal && dryRunResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                  <FiEye className="mr-2 text-blue-500" />
                  Dry Run Results
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  No accounts were modified during this simulation.
                </p>
              </div>
              <button
                onClick={() => setShowDryRunModal(false)}
                className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Period
                  </div>
                  <div className="font-bold text-slate-800">
                    {dryRunResult.summary.period}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Rate
                  </div>
                  <div className="font-bold text-blue-600">
                    {dryRunResult.summary.rate}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Accounts
                  </div>
                  <div className="font-bold text-slate-800">
                    {dryRunResult.summary.beneficiaryCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Total Payout
                  </div>
                  <div className="font-bold text-green-600">
                    ₦{dryRunResult.summary.totalAmount}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">
                  Sample Calculations (First 5)
                </h3>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <tr>
                        <th className="px-4 py-3">Account ID</th>
                        <th className="px-4 py-3 text-right">
                          Current Balance
                        </th>
                        <th className="px-4 py-3 text-right">
                          Calculated Interest
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dryRunResult.preview.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium text-slate-700">
                            #{item.accountId}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-600">
                            ₦{Number(item.currentBalance).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-green-600">
                            + ₦{Number(item.calculatedAmount).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowDryRunModal(false)}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestPosting;
