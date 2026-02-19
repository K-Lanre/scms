import React from "react";
import { Link } from "react-router-dom";
import {
  FiPlusCircle,
  FiMinusCircle,
  FiSettings,
  FiTrendingUp,
  FiDollarSign,
  FiPieChart,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SavingsOverview = () => {
  const savingsData = [
    { month: "Jan", amount: 120000 },
    { month: "Feb", amount: 135000 },
    { month: "Mar", amount: 130000 },
    { month: "Apr", amount: 155000 },
    { month: "May", amount: 160000 },
    { month: "Jun", amount: 185000 },
  ];

  /* Mock Data */
  const accounts = [
    {
      id: 1,
      type: "Regular Savings",
      balance: "250,000.00",
      interest: "12,500.00",
    },
    {
      id: 2,
      type: "Target Savings (Xmas)",
      balance: "120,000.00",
      interest: "3,200.00",
    },
    {
      id: 3,
      type: "Fixed Deposit",
      balance: "500,000.00",
      interest: "45,000.00",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Savings Overview</h1>
          <p className="text-gray-600">
            Manage your savings portfolio and transactions
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/savings/operations"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FiPlusCircle className="mr-2" /> Operations
          </Link>
          <Link
            to="/savings/products"
            className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FiSettings className="mr-2" /> Products
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <FiDollarSign className="text-xl" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
              +15% vs last month
            </span>
          </div>
          <h3 className="text-3xl font-bold">₦870,000.00</h3>
          <p className="text-blue-100 text-sm mt-1">Total Savings Balance</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <FiTrendingUp className="text-xl" />
            </div>
            <span className="text-xs font-semibold bg-green-50 text-green-600 px-2 py-1 rounded">
              +12% APY
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">₦60,700.00</h3>
          <p className="text-gray-500 text-sm mt-1">Total Interest Earned</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <FiPieChart className="text-xl" />
            </div>
            <span className="text-xs font-semibold bg-purple-50 text-purple-600 px-2 py-1 rounded">
              3 Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">3 Accounts</h3>
          <p className="text-gray-500 text-sm mt-1">Active Savings Plans</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Savings Growth
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(val) => `₦${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Account List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Your Accounts
          </h3>
          <div className="space-y-4">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-700">
                    {acc.type}
                  </span>
                  <span className="bg-green-50 text-green-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Balance</p>
                    <p className="text-lg font-bold text-gray-900">
                      ₦{acc.balance}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase">Interest</p>
                    <p className="text-sm font-medium text-green-600">
                      +₦{acc.interest}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
            View All Accounts
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavingsOverview;
