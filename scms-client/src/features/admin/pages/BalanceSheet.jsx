import React, { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiPieChart,
  FiRefreshCw,
  FiArrowDown,
  FiArrowUp,
} from "react-icons/fi";
import { getBalanceSheet } from "../services/reportApi";
import toast from "react-hot-toast";

const BalanceSheet = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getBalanceSheet();
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load Balance Sheet");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  if (loading && !data)
    return (
      <div className="p-10 text-center text-gray-400">
        Loading Balance Sheet...
      </div>
    );

  if (!data)
    return (
      <div className="p-10 text-center text-red-400">
        Could not load report data.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Balance Sheet</h1>
          <p className="text-gray-600">
            Overview of Assets, Liabilities, and Equity.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assets Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center">
              <FiTrendingUp className="text-blue-600 mr-2" />
              <h2 className="text-lg font-bold text-blue-900">ASSETS</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-gray-600">Liquid Cash (Bank/Vault)</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(data.assets.liquidCash)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-gray-600">
                  Outstanding Loans (Principal)
                </span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(data.assets.outstandingLoans)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 text-xl">
                <span className="font-black text-gray-800 uppercase tracking-wider">
                  Total Assets
                </span>
                <span className="font-black text-blue-600">
                  {formatCurrency(data.assets.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Liabilities & Equity Column */}
        <div className="space-y-6">
          {/* Liabilities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center">
              <FiArrowDown className="text-red-600 mr-2" />
              <h2 className="text-lg font-bold text-red-900">LIABILITIES</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-gray-600">Member Total Savings</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(data.liabilities.memberSavings)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 font-bold text-gray-800">
                <span>Total Liabilities</span>
                <span>{formatCurrency(data.liabilities.total)}</span>
              </div>
            </div>
          </div>

          {/* Equity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center">
              <FiPieChart className="text-green-600 mr-2" />
              <h2 className="text-lg font-bold text-green-900">EQUITY</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-gray-600">Total Share Capital</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(data.equity.shareCapital)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-gray-600">
                  Retained Earnings (Reserves)
                </span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(data.equity.retainedEarnings)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 font-bold text-gray-800">
                <span>Total Equity</span>
                <span>{formatCurrency(data.equity.total)}</span>
              </div>
            </div>
          </div>

          {/* L+E Summary */}
          <div className="bg-slate-800 rounded-xl shadow-md p-6 flex justify-between items-center">
            <span className="text-slate-300 font-bold uppercase tracking-wider">
              Total Liab. & Equity
            </span>
            <span className="text-2xl font-black text-white">
              {formatCurrency(data.balance.totalLiabilitiesAndEquity)}
            </span>
          </div>
        </div>
      </div>

      {/* Validation Alert */}
      <div
        className={`p-4 rounded-lg flex items-center ${Math.abs(data.balance.totalAssets - data.balance.totalLiabilitiesAndEquity) < 0.01 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
      >
        <FiDollarSign className="mr-2" />
        <span className="font-bold">
          {Math.abs(
            data.balance.totalAssets - data.balance.totalLiabilitiesAndEquity,
          ) < 0.01
            ? "Balance sheet is balanced. Assets equal Liabilities + Equity."
            : `Balance sheet mismatch! Variance: ${formatCurrency(data.balance.totalAssets - data.balance.totalLiabilitiesAndEquity)}`}
        </span>
      </div>
    </div>
  );
};

export default BalanceSheet;
