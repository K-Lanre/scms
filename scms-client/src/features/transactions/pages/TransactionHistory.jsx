import React, { useState } from "react";
import { FiDownload, FiSearch, FiFilter, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Data
  const transactions = [
    {
      id: "TRX-001",
      date: "2024-02-01",
      description: "Monthly Savings Deposit",
      category: "Savings",
      amount: 50000,
      type: "credit",
      status: "Success",
    },
    {
      id: "TRX-002",
      date: "2024-02-01",
      description: "Loan Repayment - Feb",
      category: "Loan",
      amount: 42000,
      type: "credit",
      status: "Success",
    },
    {
      id: "TRX-003",
      date: "2024-01-28",
      description: "Emergency Withdrawal",
      category: "Savings",
      amount: 15000,
      type: "debit",
      status: "Success",
    },
    {
      id: "TRX-004",
      date: "2024-01-25",
      description: "Office Supplies",
      category: "Expense",
      amount: 12500,
      type: "debit",
      status: "Success",
    },
    {
      id: "TRX-005",
      date: "2024-01-20",
      description: "Registration Fee",
      category: "Membership",
      amount: 5000,
      type: "credit",
      status: "Success",
    },
    {
      id: "TRX-006",
      date: "2024-01-15",
      description: "Bank Charges",
      category: "Bank",
      amount: 500,
      type: "debit",
      status: "Success",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Transaction History
          </h1>
          <p className="text-gray-600">
            View and manage all financial records.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <FiDownload className="mr-2" /> Export
          </button>
          <Link
            to="/transactions/entry"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FiPlus className="mr-2" /> Manual Entry
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500">
              <option value="">All Categories</option>
              <option value="savings">Savings</option>
              <option value="loan">Loans</option>
              <option value="expense">Expenses</option>
            </select>
            <select className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500">
              <option value="">All Types</option>
              <option value="credit">Credit (In)</option>
              <option value="debit">Debit (Out)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trx.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {trx.description}
                    </div>
                    <div className="text-xs text-gray-400">{trx.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {trx.category}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${
                      trx.type === "credit" ? "text-green-600" : "text-gray-800"
                    }`}
                  >
                    {trx.type === "credit" ? "+" : "-"}₦
                    {trx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {trx.status}
                    </span>
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

export default TransactionHistory;
