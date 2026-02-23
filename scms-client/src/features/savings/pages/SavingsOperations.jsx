import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SavingsOperations = () => {
  const [activeTab, setActiveTab] = useState("deposit");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(activeTab.toUpperCase(), data);
    toast.success(
      `${activeTab === "deposit" ? "Deposit" : "Withdrawal"} request submitted successfully!`,
    );
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/savings"
          className="text-sm text-blue-600 hover:underline mb-2 inline-block"
        >
          &larr; Back to Overview
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Savings Operations</h1>
        <p className="text-gray-600">
          Process deposits and withdrawals securely.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("deposit")}
            className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center ${
              activeTab === "deposit"
                ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FiArrowUpCircle className="mr-2 text-xl" /> Deposit Funds
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center ${
              activeTab === "withdraw"
                ? "text-red-600 border-b-2 border-red-600 bg-red-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FiArrowDownCircle className="mr-2 text-xl" /> Withdraw Funds
          </button>
        </div>

        <div className="p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 max-w-lg mx-auto"
          >
            {/* Account Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Account
              </label>
              <select
                {...register("accountId", {
                  required: "Please select an account",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">-- Choose Savings Account --</option>
                <option value="1">Regular Savings - ₦250,000.00</option>
                <option value="2">Target Savings (Xmas) - ₦120,000.00</option>
                <option value="3">Fixed Deposit - ₦500,000.00</option>
              </select>
              {errors.accountId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountId.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₦)
              </label>
              <input
                type="number"
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 100, message: "Minimum amount is ₦100" },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Payment Method (Deposit Only) */}
            {activeTab === "deposit" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Source
                </label>
                <select
                  {...register("paymentSource")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="card">Bank Card (Online)</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="cash">Cash (Office)</option>
                </select>
              </div>
            )}

            {/* Reason (Withdrawal Only) */}
            {activeTab === "withdraw" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Withdrawal
                </label>
                <textarea
                  {...register("reason", {
                    required: "Reason is required for withdrawals",
                  })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Briefly state why you are withdrawing..."
                ></textarea>
                {errors.reason && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.reason.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition-transform active:scale-[0.98] ${
                activeTab === "deposit"
                  ? "bg-green-600 hover:bg-green-700 shadow-green-200"
                  : "bg-red-600 hover:bg-red-700 shadow-red-200"
              }`}
            >
              {activeTab === "deposit"
                ? "Proceed with Deposit"
                : "Request Withdrawal"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SavingsOperations;
