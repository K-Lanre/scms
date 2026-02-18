import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiCalendar, FiDollarSign, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const LoanRepayment = () => {
  const { register, handleSubmit, reset } = useForm();

  // Mock Schedule
  const schedule = [
    {
      no: 1,
      date: "2024-03-01",
      principal: 40000,
      interest: 2000,
      total: 42000,
      status: "Paid",
    },
    {
      no: 2,
      date: "2024-04-01",
      principal: 40000,
      interest: 1800,
      total: 41800,
      status: "Due",
    },
    {
      no: 3,
      date: "2024-05-01",
      principal: 40000,
      interest: 1600,
      total: 41600,
      status: "Pending",
    },
  ];

  const onSubmit = (data) => {
    console.log(data);
    alert("Repayment recorded successfully!");
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Link
          to="/loans/portfolio"
          className="text-sm text-blue-600 hover:underline mb-2 inline-block"
        >
          &larr; Back to Portfolio
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Loan Repayments</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Repayment Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            Record Repayment
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan ID / Member
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter Loan ID or Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₦)
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="number"
                  {...register("amount", { required: true })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="date"
                  {...register("date", { required: true })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                {...register("method")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md mt-4">
              Record Payment
            </button>
          </form>
        </div>

        {/* Schedule View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Repayment Schedule
              </h2>
              <span className="text-sm text-gray-500">
                Loan ID:{" "}
                <span className="font-mono text-gray-900 font-bold">
                  LN-2024-001
                </span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Principal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Interest
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {schedule.map((item) => (
                    <tr key={item.no} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.no}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        ₦{item.principal.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        ₦{item.interest.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        ₦{item.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            item.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Due"
                                ? "bg-yellow-100 text-yellow-700"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanRepayment;
