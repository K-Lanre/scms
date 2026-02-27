import React, { useState, useEffect } from "react";
import {
  FiTrendingDown,
  FiTrendingUp,
  FiActivity,
  FiRefreshCw,
  FiCalendar,
} from "react-icons/fi";
import { getIncomeStatement } from "../services/reportApi";
import toast from "react-hot-toast";

const IncomeStatement = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getIncomeStatement(
        dateRange.startDate && dateRange.endDate ? dateRange : {},
      );
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load Income Statement");
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
        Loading Income Statement...
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
      <div className="flex justify-between items-center font-bold">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Income Statement (P&L)
          </h1>
          <p className="text-gray-600">Revenue and Expenses breakdown.</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 border border-gray-200 rounded-lg">
            <FiCalendar className="text-gray-400" />
            <span className="text-sm font-medium">
              {data.period.startDate} - {data.period.endDate}
            </span>
          </div>
          <button
            onClick={fetchData}
            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Revenue Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-green-50 flex justify-between items-center">
            <div className="flex items-center text-green-700">
              <FiTrendingUp className="mr-2" />
              <h2 className="font-bold text-lg">OPERATING REVENUE</h2>
            </div>
            <span className="font-black text-green-700 text-lg">
              {formatCurrency(data.revenue.totalRevenue)}
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-2">
              <label className="text-gray-600 uppercase text-xs font-bold tracking-widest">
                Description
              </label>
              <label className="text-gray-600 uppercase text-xs font-bold tracking-widest">
                Amount
              </label>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-gray-700">Interest Income on Loans</span>
              <span className="font-bold text-gray-900">
                {formatCurrency(data.revenue.loanInterestIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-gray-700">Other Surcharges/Fees</span>
              <span className="font-bold text-gray-900">
                {formatCurrency(data.revenue.otherIncome)}
              </span>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-red-50 flex justify-between items-center">
            <div className="flex items-center text-red-700">
              <FiTrendingDown className="mr-2" />
              <h2 className="font-bold text-lg">OPERATING EXPENSES</h2>
            </div>
            <span className="font-black text-red-700 text-lg">
              {formatCurrency(data.expenses.totalExpenses)}
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-gray-700">
                Interest Paid on Member Savings
              </span>
              <span className="font-bold text-gray-900 text-red-600">
                ({formatCurrency(data.expenses.interestOnSavings)})
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-gray-700">
                Annual Dividends Distributed
              </span>
              <span className="font-bold text-gray-900 text-red-600">
                ({formatCurrency(data.expenses.dividendsDistributed)})
              </span>
            </div>
          </div>
        </div>

        {/* Net Profit Summary */}
        <div
          className={`rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center space-y-2 border-2 ${data.netProfit >= 0 ? "bg-white border-green-500" : "bg-red-900 border-red-900 text-white"}`}
        >
          <span className="uppercase text-xs font-black tracking-[0.2em] text-gray-400">
            Net Operational Profit / Loss
          </span>
          <span
            className={`text-4xl font-black ${data.netProfit >= 0 ? "text-green-600" : "text-white"}`}
          >
            {formatCurrency(data.netProfit)}
          </span>
          <div className="flex items-center space-x-2 mt-4 text-sm">
            <FiActivity
              className={data.netProfit >= 0 ? "text-green-500" : "text-white"}
            />
            <span
              className={
                data.netProfit >= 0 ? "text-gray-500" : "text-gray-300"
              }
            >
              {data.netProfit >= 0
                ? "System is operating profitably."
                : "System is currently operating at a loss."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeStatement;
