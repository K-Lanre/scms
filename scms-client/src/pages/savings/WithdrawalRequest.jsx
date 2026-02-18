import React from "react";
import { useForm } from "react-hook-form";
import {
  FiDollarSign,
  FiInfo,
  FiAlertCircle,
  FiSend,
  FiCreditCard,
  FiFileText,
} from "react-icons/fi";

const WithdrawalRequest = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert("Withdrawal request submitted successfully! (Simulation)");
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900">Withdraw Funds</h1>
        <p className="text-slate-600 mt-2">
          Request to withdraw funds from your savings account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Amount to Withdraw (₦)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₦
                </div>
                <input
                  {...register("amount", {
                    required: "Amount is required",
                    min: {
                      value: 1000,
                      message: "Minimum withdrawal is ₦1,000",
                    },
                  })}
                  type="number"
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Withdrawal Purpose
              </label>
              <select
                {...register("purpose", { required: "Purpose is required" })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              >
                <option value="">Select a reason</option>
                <option value="emergency">Emergency Fund</option>
                <option value="business">Business Investment</option>
                <option value="education">School Fees</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Payment Narration
              </label>
              <textarea
                {...register("narration")}
                rows="3"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"
                placeholder="Briefly describe the reason for this withdrawal..."
              />
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start space-x-3">
              <FiAlertCircle className="text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <span className="font-bold">Note:</span> Large withdrawals
                (above ₦500,000) may require additional administrative calls and
                up to 48 hours to process.
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-200"
            >
              <FiSend />
              <span>Submit Withdrawal Request</span>
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex justify-between items-start mb-8">
              <FiDollarSign className="text-2xl text-blue-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Available Balance
              </span>
            </div>
            <div className="mb-2">
              <span className="text-sm text-slate-400">Total Savings</span>
              <h2 className="text-3xl font-black">₦250,500.00</h2>
            </div>
            <div className="pt-4 border-t border-slate-700 mt-4 flex justify-between items-center text-xs">
              <span className="text-slate-400">Account ID: SM-12345</span>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-bold">
                Active
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <FiInfo className="mr-2 text-blue-500" />
              Quick Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-sm text-slate-600">
                <FiCreditCard className="mr-2 mt-1 text-slate-400 flex-shrink-0" />
                <span>Daily withdrawal limit is ₦1,000,000.</span>
              </li>
              <li className="flex items-start text-sm text-slate-600">
                <FiFileText className="mr-2 mt-1 text-slate-400 flex-shrink-0" />
                <span>
                  A flat service fee of ₦50 applies to all successful
                  withdrawals.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalRequest;
