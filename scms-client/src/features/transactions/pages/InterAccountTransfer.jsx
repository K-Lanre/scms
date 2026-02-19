import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiArrowRight,
  FiDollarSign,
  FiInfo,
  FiCheckCircle,
  FiRefreshCw,
  FiCreditCard,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const InterAccountTransfer = () => {
  const { register, handleSubmit, watch, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log(data);
      alert("Transfer successful!");
      setIsSubmitting(false);
      reset();
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Internal Transfer
          </h1>
          <p className="text-gray-600">
            Move funds between your accounts or to other members.
          </p>
        </div>
        <Link
          to="/transactions"
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          View History
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* From Account */}
            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                Source Account
              </label>
              <div className="p-4 rounded-xl border-2 border-blue-100 bg-blue-50/30">
                <select
                  {...register("fromAccount", { required: true })}
                  className="w-full bg-transparent font-bold text-gray-900 outline-none"
                >
                  <option value="SB-4821">Savings (₦250,500)</option>
                  <option value="TS-1120">Target Savings (₦45,000)</option>
                </select>
                <div className="mt-2 text-xs text-blue-600 font-medium">
                  Available Balance
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center text-gray-300 transform scale-150">
              <FiArrowRight />
            </div>

            {/* To Account */}
            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                Destination Account
              </label>
              <div className="p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 focus-within:border-blue-500 transition-all">
                <select
                  {...register("toAccount", { required: true })}
                  className="w-full bg-transparent font-bold text-gray-900 outline-none"
                >
                  <option value="">Select Destination</option>
                  <option value="SH-8821">Shares Account</option>
                  <option value="other">Another Member's Account</option>
                </select>
                <div className="mt-2 text-xs text-gray-400 font-medium">
                  Choose recipient
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
              Transfer Details
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="number"
                placeholder="0.00"
                {...register("amount", { required: true, min: 1 })}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 outline-none focus:border-blue-500 text-xl font-bold transition-all text-gray-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
              Description (Optional)
            </label>
            <textarea
              {...register("description")}
              placeholder="What's this transfer for?"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 outline-none focus:border-blue-500 text-sm transition-all text-gray-900 h-24 resize-none"
            />
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start space-x-3">
            <FiInfo className="text-amber-500 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Transfers between your own accounts are instant and free.
              Transfers to other members may take up to 24 hours to reflect if
              security checks are triggered.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-black text-white shadow-lg transition-all flex items-center justify-center space-x-2 ${
              isSubmitting
                ? "bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            }`}
          >
            {isSubmitting ? (
              <FiRefreshCw className="animate-spin" />
            ) : (
              <FiCheckCircle />
            )}
            <span>
              {isSubmitting ? "Processing..." : "Confirm & Transfer Funds"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterAccountTransfer;
