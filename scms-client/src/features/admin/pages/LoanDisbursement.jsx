import React, { useState } from "react";
import {
  FiCreditCard,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiDollarSign,
  FiEye,
  FiFilter,
  FiSearch,
} from "react-icons/fi";

const LoanDisbursement = () => {
  const [filter, setFilter] = useState("appraised");

  // Mock data for loans ready for disbursement
  const loans = [
    {
      id: "LON-882",
      memberName: "James Wilson",
      amount: 500000,
      product: "Business Loan",
      appraisalDate: "2024-02-15",
      status: "appraised",
      repaymentPeriod: "12 months",
      interestRate: "5%",
    },
    {
      id: "LON-901",
      memberName: "Rebecca Thompson",
      amount: 150000,
      product: "Personal Loan",
      appraisalDate: "2024-02-16",
      status: "appraised",
      repaymentPeriod: "6 months",
      interestRate: "8%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Loan Disbursement
          </h1>
          <p className="text-gray-600">
            Finalize and disburse funds for appraised loan requests.
          </p>
        </div>

        <div className="flex space-x-3 mt-4 md:mt-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search loans..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
        <FiAlertCircle className="text-blue-600 text-xl mt-0.5" />
        <div>
          <h3 className="text-blue-900 font-bold">Important Note</h3>
          <p className="text-blue-700 text-sm">
            Disbursing a loan will immediately transfer funds to the member's
            account and activate the repayment schedule. Ensure all physical
            documentation is signed before proceeding.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Loan ID / Member
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount & Rate
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Appraised On
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loans.map((loan) => (
                <tr
                  key={loan.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mr-3 text-lg">
                        <FiCreditCard />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{loan.id}</div>
                        <div className="text-sm text-gray-500">
                          {loan.memberName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      ₦{loan.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      {loan.interestRate} Interest RATE
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">
                      {loan.repaymentPeriod}
                    </div>
                    <div className="text-xs text-gray-500">{loan.product}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-gray-400" />
                      {new Date(loan.appraisalDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold">
                        <FiCheckCircle />
                        <span>Disburse</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loans.length === 0 && (
          <div className="py-20 text-center">
            <FiCheckCircle className="text-5xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No loans currently pending disbursement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanDisbursement;
