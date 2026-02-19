import React, { useState } from "react";
import {
  FiDownload,
  FiPrinter,
  FiFilter,
  FiCalendar,
  FiEye,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const FinancialReports = () => {
  const [dateRange, setDateRange] = useState("monthly");

  const financialData = {
    monthly: [
      { month: "Jan", income: 4000, expenses: 2400, profit: 1600 },
      { month: "Feb", income: 3000, expenses: 1398, profit: 1602 },
      { month: "Mar", income: 2000, expenses: 9800, profit: -7800 },
      { month: "Apr", income: 2780, expenses: 3908, profit: -1128 },
      { month: "May", income: 1890, expenses: 4800, profit: -2910 },
      { month: "Jun", income: 2390, expenses: 3800, profit: -1410 },
      { month: "Jul", income: 3490, expenses: 4300, profit: -810 },
    ],
    quarterly: [
      { quarter: "Q1", income: 9000, expenses: 13598, profit: -4598 },
      { quarter: "Q2", income: 7060, expenses: 12508, profit: -5448 },
      { quarter: "Q3", income: 12000, expenses: 9800, profit: 2200 },
      { quarter: "Q4", income: 15000, expenses: 11000, profit: 4000 },
    ],
  };

  const expenseBreakdown = [
    { name: "Salaries", value: 40, color: "#0088FE" },
    { name: "Operations", value: 25, color: "#00C49F" },
    { name: "Loan Loss", value: 15, color: "#FFBB28" },
    { name: "Marketing", value: 12, color: "#FF8042" },
    { name: "Others", value: 8, color: "#8884D8" },
  ];

  const reports = [
    { id: 1, name: "Income Statement", date: "2024-01-15", size: "2.4 MB" },
    { id: 2, name: "Balance Sheet", date: "2024-01-15", size: "1.8 MB" },
    { id: 3, name: "Cash Flow Statement", date: "2024-01-14", size: "3.2 MB" },
    {
      id: 4,
      name: "Loan Portfolio Report",
      date: "2024-01-13",
      size: "4.1 MB",
    },
    {
      id: 5,
      name: "Member Savings Report",
      date: "2024-01-12",
      size: "5.6 MB",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Financial Reports
          </h1>
          <p className="text-gray-600">
            Comprehensive financial analysis and reporting
          </p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center bg-white text-gray-700 font-medium">
            <FiPrinter className="mr-2" />
            Print
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium shadow-sm transition-colors">
            <FiDownload className="mr-2" />
            Export All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center font-medium transition-colors">
              <FiFilter className="mr-2" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Income vs Expenses
            </h3>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-gray-50 outline-none">
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData[dateRange]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey={dateRange === "monthly" ? "month" : "quarter"}
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  fill="#3b82f6"
                  name="Income"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  fill="#f43f5e"
                  name="Expenses"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Expense Breakdown
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={5}
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Profit Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">
          Profit/Loss Trend
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={financialData[dateRange]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey={dateRange === "monthly" ? "month" : "quarter"}
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Generated Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Generated Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  File Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                        <FiCalendar className="size-4" />
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {report.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {report.size}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 flex items-center transition-colors">
                        <FiEye className="mr-1" /> View
                      </button>
                      <button className="text-gray-600 hover:text-green-600 flex items-center transition-colors">
                        <FiDownload className="mr-1" /> Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
