import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiPrinter,
  FiDownload,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiList,
} from "react-icons/fi";

const LoanRepaymentLedger = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("history");

  // Mock Loan Data
  const loan = {
    id: id || "LN-2024-001",
    memberName: "John Doe",
    product: "Business Loan",
    amount: 500000,
    balance: 380000,
    interestRate: "5%",
    status: "Active",
    disbursedDate: "2024-01-10",
  };

  // Mock Repayment History
  const history = [
    {
      id: "TRX-101",
      date: "2024-02-10",
      amount: 42000,
      principal: 40000,
      interest: 2000,
      method: "Bank Transfer",
      receiptedBy: "Admin Sarah",
    },
    {
      id: "TRX-125",
      date: "2024-03-10",
      amount: 41800,
      principal: 40000,
      interest: 1800,
      method: "Cash",
      receiptedBy: "Staff Mike",
    },
    {
      id: "TRX-150",
      date: "2024-04-10",
      amount: 41600,
      principal: 40000,
      interest: 1600,
      method: "Bank Transfer",
      receiptedBy: "Admin Sarah",
    },
  ];

  // Mock Schedule
  const schedule = [
    { no: 1, date: "2024-02-10", total: 42000, status: "Paid" },
    { no: 2, date: "2024-03-10", total: 41800, status: "Paid" },
    { no: 3, date: "2024-04-10", total: 41600, status: "Paid" },
    { no: 4, date: "2024-05-10", total: 41400, status: "Due" },
    { no: 5, date: "2024-06-10", total: 41200, status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <Link
            to="/loans/portfolio"
            className="flex items-center text-sm text-blue-600 hover:underline mb-2"
          >
            <FiArrowLeft className="mr-1" /> Back to Portfolio
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Loan Repayment Ledger
          </h1>
          <p className="text-gray-600">
            Detailed transaction history for Loan ID:{" "}
            <span className="font-mono font-bold text-blue-600">{loan.id}</span>
          </p>
        </div>

        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <FiPrinter />
            <span>Print Ledger</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-bold shadow-md transition-colors">
            <FiDownload />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Loan Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
            Total Principal
          </p>
          <p className="text-xl font-extrabold text-gray-900 mt-1">
            ₦{loan.amount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
            Outstanding Balance
          </p>
          <p className="text-xl font-extrabold text-red-600 mt-1">
            ₦{loan.balance.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
            Interest Rate
          </p>
          <p className="text-xl font-extrabold text-blue-600 mt-1">
            {loan.interestRate}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">
            Status
          </p>
          <div className="mt-1 flex items-center">
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold mr-2">
              {loan.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === "history" ? "text-blue-600 border-blue-600 bg-blue-50/30" : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"}`}
          >
            <div className="flex items-center justify-center">
              <FiList className="mr-2" /> Payment History
            </div>
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === "schedule" ? "text-blue-600 border-blue-600 bg-blue-50/30" : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"}`}
          >
            <div className="flex items-center justify-center">
              <FiCalendar className="mr-2" /> Original Schedule
            </div>
          </button>
        </div>

        <div className="p-0">
          {activeTab === "history" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Breakdown
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total Paid
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Method / Auth
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((trx) => (
                    <tr key={trx.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-mono text-sm font-bold text-blue-600">
                        {trx.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(trx.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-500">
                          <div>
                            Principal: ₦{trx.principal.toLocaleString()}
                          </div>
                          <div>Interest: ₦{trx.interest.toLocaleString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">
                          ₦{trx.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs">
                          <div className="font-medium text-gray-800">
                            {trx.method}
                          </div>
                          <div className="text-gray-400">
                            By: {trx.receiptedBy}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schedule.map((item) => (
                    <tr key={item.no} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {item.no}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">
                        ₦{item.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Due"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanRepaymentLedger;
