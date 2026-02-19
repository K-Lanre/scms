import React from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  FiTrendingUp,
  FiAlertCircle,
  FiCheckSquare,
  FiPlusSquare,
} from "react-icons/fi";

const LoanPortfolio = () => {
  const loanDistribution = [
    { name: "Business", value: 4500000, color: "#0088FE" },
    { name: "Personal", value: 2100000, color: "#00C49F" },
    { name: "Emergency", value: 800000, color: "#FFBB28" },
    { name: "Education", value: 1200000, color: "#FF8042" },
  ];

  const repaymentTrend = [
    { month: "Oct", expected: 400, actual: 380 },
    { month: "Nov", expected: 420, actual: 405 },
    { month: "Dec", expected: 450, actual: 420 },
    { month: "Jan", expected: 480, actual: 440 },
  ];

  const kpiData = [
    {
      title: "Total Active Loans",
      value: "₦8.6M",
      sub: "42 active accounts",
      icon: <FiCheckSquare />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Interest Revenue",
      value: "₦1.2M",
      sub: "Year to date",
      icon: <FiTrendingUp />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "At Risk (PAR 30)",
      value: "₦450k",
      sub: "5 accounts overdue",
      icon: <FiAlertCircle />,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Loan Portfolio</h1>
          <p className="text-gray-600">
            Overview of lending performance and risk.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/loans"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FiPlusSquare className="mr-2" /> New Application
          </Link>
          <Link
            to="/loans/requests"
            className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Review Requests
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start space-x-4"
          >
            <div className={`p-3 rounded-lg ${kpi.bg} ${kpi.color}`}>
              <span className="text-2xl">{kpi.icon}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {kpi.value}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Portfolio Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {loanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6">
            {loanDistribution.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Repayment Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Repayment Performance
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repaymentTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="expected"
                  fill="#e2e8f0"
                  name="Expected (k)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="actual"
                  fill="#10b981"
                  name="Actual (k)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-blue-900">Manage Repayments</h3>
          <p className="text-blue-700 text-sm">
            Record manual payments or view amortization schedules.
          </p>
        </div>
        <Link
          to="/loans/repayments"
          className="mt-4 md:mt-0 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          Go to Repayments &rarr;
        </Link>
      </div>
    </div>
  );
};

export default LoanPortfolio;
