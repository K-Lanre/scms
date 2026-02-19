import React, { useState } from "react";
import {
  FiFileText,
  FiDownload,
  FiPrinter,
  FiFilter,
  FiCalendar,
  FiSearch,
} from "react-icons/fi";

const FinancialStatements = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Mock statement data
  const statement = [
    {
      date: "2024-02-01",
      description: "Opening Balance",
      reference: "BAL-FWD",
      debit: 0,
      credit: 0,
      balance: 150000,
    },
    {
      date: "2024-02-05",
      description: "Monthly Savings Contribution",
      reference: "SAV-8821",
      debit: 0,
      credit: 50000,
      balance: 200000,
    },
    {
      date: "2024-02-10",
      description: "Loan Repayment - LN-2024-001",
      reference: "REPAY-441",
      debit: 42000,
      credit: 0,
      balance: 158000,
    },
    {
      date: "2024-02-15",
      description: "Interest Earned (Fixed Savings)",
      reference: "INT-POST-Q1",
      debit: 0,
      credit: 2500,
      balance: 160500,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Account Statements
          </h1>
          <p className="text-gray-600">
            Generate and view formal financial statements.
          </p>
        </div>

        <div className="flex space-x-2 mt-4 md:mt-0">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <FiPrinter />
            <span>Print Statement</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-bold shadow-md transition-colors">
            <FiDownload />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Select Account
            </label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
              <option>General Savings (SB-482)</option>
              <option>Target Savings (TS-112)</option>
              <option>Loan Account (LA-2024)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Start Date
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              End Date
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors text-sm font-bold">
              <FiFilter />
              <span>Generate Statement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statement Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
              <FiFileText />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Statement of Account</h3>
              <p className="text-xs text-gray-500 font-mono">
                Period: Jan 01, 2024 - Feb 18, 2024
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-bold uppercase">
              Closing Balance
            </p>
            <p className="text-2xl font-black text-gray-900">₦160,500.00</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Description / Ref
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Debit (Out)
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Credit (In)
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {statement.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">
                      {row.description}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {row.reference}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-red-600 font-medium">
                    {row.debit > 0 ? `₦${row.debit.toLocaleString()}` : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-green-600 font-medium">
                    {row.credit > 0 ? `₦${row.credit.toLocaleString()}` : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                    ₦{row.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Total Debits:</span>
              <span className="text-red-600 font-bold">₦42,000.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Total Credits:</span>
              <span className="text-green-600 font-bold">₦52,500.00</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 font-black text-gray-900">
              <span>Net Change:</span>
              <span>+₦10,500.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatements;
