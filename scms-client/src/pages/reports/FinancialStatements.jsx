import React, { useState } from "react";
import {
  FiFileText,
  FiDownload,
  FiPrinter,
  FiCalendar,
  FiBarChart2,
  FiTrendingUp,
  FiTrendingDown,
  FiChevronRight,
} from "react-icons/fi";

const FinancialStatements = () => {
  const [activeReport, setActiveReport] = useState("trial-balance");

  const reports = [
    {
      id: "trial-balance",
      name: "Trial Balance",
      description: "Summary of all ledger balances.",
    },
    {
      id: "balance-sheet",
      name: "Balance Sheet",
      description: "Assets, liabilities, and equity.",
    },
    {
      id: "profit-loss",
      name: "Profit & Loss",
      description: "Income and expenditure summary.",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Financial Statements
          </h1>
          <p className="text-slate-600">
            Generate and export official financial reports.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-bold transition-all">
            <FiPrinter />
            <span>Print</span>
          </button>
          <button className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg">
            <FiDownload />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Selection */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
            Available Reports
          </h3>
          <div className="space-y-2">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${
                  activeReport === report.id
                    ? "bg-white border-blue-500 shadow-md ring-4 ring-blue-50"
                    : "bg-white/50 border-transparent hover:bg-white hover:border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-bold ${activeReport === report.id ? "text-blue-600" : "text-slate-800"}`}
                  >
                    {report.name}
                  </span>
                  <FiChevronRight
                    className={
                      activeReport === report.id
                        ? "text-blue-500"
                        : "text-slate-300"
                    }
                  />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {report.description}
                </p>
              </button>
            ))}
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mt-6">
            <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center">
              <FiCalendar className="mr-2" />
              Reporting Period
            </h4>
            <select className="w-full bg-white border border-blue-200 rounded-lg p-2 text-xs font-bold text-blue-900 outline-none">
              <option>January - December 2024</option>
              <option>Q1 2024</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Report Content Container */}
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                <FiBarChart2 className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  {reports.find((r) => r.id === activeReport)?.name}
                </h2>
                <p className="text-sm text-slate-400">
                  For the period ending Dec 31, 2024
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Report Content (Mock for Trial Balance) */}
          {activeReport === "trial-balance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <span className="text-xs font-black text-slate-400 uppercase">
                  Account Description
                </span>
                <div className="grid grid-cols-2 text-right">
                  <span className="text-xs font-black text-slate-400 uppercase">
                    Debit (₦)
                  </span>
                  <span className="text-xs font-black text-slate-400 uppercase">
                    Credit (₦)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Bank Balance (Current)", dr: "12,800,000", cr: "-" },
                  { name: "Member Loans Portfolio", dr: "2,650,000", cr: "-" },
                  { name: "Cooperative Savings Pot", dr: "-", cr: "9,850,500" },
                  { name: "Operational Capital", dr: "-", cr: "3,500,000" },
                  { name: "Interest Income", dr: "-", cr: "2,150,000" },
                  { name: "Office Rent & Utils", dr: "400,500", cr: "-" },
                ].map((item, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-4 text-sm">
                    <span className="font-semibold text-slate-700">
                      {item.name}
                    </span>
                    <div className="grid grid-cols-2 text-right border-l border-slate-50 pl-4">
                      <span className="text-slate-900">{item.dr}</span>
                      <span className="text-slate-900">{item.cr}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t-2 border-slate-900 mt-10">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-lg font-black text-slate-900">
                    Total Balances
                  </span>
                  <div className="grid grid-cols-2 text-right font-black text-xl text-blue-600">
                    <span>15,850,500</span>
                    <span>15,850,500</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeReport !== "trial-balance" && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBarChart2 className="text-4xl text-slate-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Detailed Report Loading...
              </h3>
              <p className="text-slate-400 max-w-xs mx-auto text-sm italic">
                This is a high-level preview. Click "Export PDF" for the full
                regulatory compliant version.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialStatements;
