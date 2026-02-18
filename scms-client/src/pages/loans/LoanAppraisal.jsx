import React, { useState } from "react";
import {
  FiBriefcase,
  FiFileText,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";

const LoanAppraisal = () => {
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);

  const appraisals = [
    {
      id: "APP-001",
      member: "Alice Johnson",
      amount: "₦500,000",
      score: 85,
      risk: "Low",
      status: "Pending",
    },
    {
      id: "APP-002",
      member: "Bob Smith",
      amount: "₦1,200,000",
      score: 62,
      risk: "Medium",
      status: "Review",
    },
    {
      id: "APP-003",
      member: "Charlie Davis",
      amount: "₦250,000",
      score: 45,
      risk: "High",
      status: "Critical",
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Loan Appraisal & Scoring
        </h1>
        <p className="text-slate-600">
          Evaluate loan requests based on member history and risk metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appraisal List */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Pending Appraisals</h3>
            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">
              {appraisals.length} New
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {appraisals.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedAppraisal(app)}
                className={`p-6 cursor-pointer transition-all hover:bg-slate-50 flex items-center justify-between ${selectedAppraisal?.id === app.id ? "bg-blue-50/50 border-l-4 border-blue-500" : ""}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                    <FiUser size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{app.member}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      {app.id} • {app.amount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div
                      className={`text-sm font-black px-3 py-1 rounded-lg ${getScoreColor(app.score)}`}
                    >
                      {app.score}/100
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1">
                      {app.risk} Risk
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring Breakdown Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl h-full">
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <FiShield className="mr-2 text-blue-400" />
              Risk Assessment
            </h3>

            {selectedAppraisal ? (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Savings Consistency</span>
                    <span className="text-blue-400">92%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[92%]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Previous Repayments</span>
                    <span className="text-green-400">100%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[100%]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Debt-to-Savings Ratio</span>
                    <span className="text-amber-400">45%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[45%]" />
                  </div>
                </div>

                <div className="pt-8 space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black transition-all">
                    <FiCheckCircle />
                    <span>Recommend Approval</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-400 py-4 rounded-2xl font-black transition-all">
                    <FiXCircle />
                    <span>Deny Request</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <FiTrendingUp className="text-4xl text-slate-700" />
                <p className="text-slate-500 text-sm font-medium">
                  Select an appraisal from the list to view detailed scoring
                  metrics.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanAppraisal;
