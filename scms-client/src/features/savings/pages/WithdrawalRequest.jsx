import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FiDollarSign,
  FiInfo,
  FiAlertCircle,
  FiSend,
  FiCreditCard,
  FiFileText,
  FiChevronDown,
} from "react-icons/fi";
import { requestWithdrawal } from "../services/withdrawalApi";
import api from "../../../lib/api";
import toast from "react-hot-toast";

const WithdrawalRequest = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      amount: "",
      purpose: "",
      narration: "",
      accountId: "",
    },
  });

  const selectedAccountId = watch("accountId");
  const selectedAccount = accounts.find(
    (a) => a.id === parseInt(selectedAccountId),
  );

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await api.get("/accounts/my-accounts");
        setAccounts(data.data.accounts);
        if (data.data.accounts.length > 0) {
          reset({ accountId: data.data.accounts[0].id.toString() });
        }
      } catch (error) {
        toast.error("Failed to load your accounts");
      }
    };
    fetchAccounts();
  }, [reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await requestWithdrawal({
        accountId: parseInt(data.accountId),
        amount: parseFloat(data.amount),
        reason: `${data.purpose}${data.narration ? ": " + data.narration : ""}`,
      });
      toast.success("Withdrawal request submitted successfully!");
      reset({ amount: "", purpose: "", narration: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
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
                Select Account
              </label>
              <div className="relative">
                <select
                  {...register("accountId", {
                    required: "Account is required",
                  })}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none"
                >
                  <option value="">Select an account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountType.replace("_", " ").toUpperCase()} -{" "}
                      {acc.accountNumber}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              {errors.accountId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.accountId.message}
                </p>
              )}
            </div>

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
                  step="0.01"
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
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="Business Investment">Business Investment</option>
                <option value="School Fees">School Fees</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Additional Note (Optional)
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
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-bold transition-all shadow-lg ${
                isLoading
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
              }`}
            >
              <FiSend />
              <span>
                {isLoading ? "Submitting..." : "Submit Withdrawal Request"}
              </span>
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
              <span className="text-sm text-slate-400">
                {selectedAccount
                  ? selectedAccount.accountType.replace("_", " ").toUpperCase()
                  : "Total Balance"}
              </span>
              <h2 className="text-3xl font-black">
                ₦
                {selectedAccount
                  ? parseFloat(selectedAccount.balance).toLocaleString()
                  : "0.00"}
              </h2>
            </div>
            <div className="pt-4 border-t border-slate-700 mt-4 flex justify-between items-center text-xs">
              <span className="text-slate-400">
                {selectedAccount
                  ? `ID: ${selectedAccount.accountNumber}`
                  : "---"}
              </span>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-bold">
                {selectedAccount ? selectedAccount.status.toUpperCase() : "---"}
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
                <span>Admin approval is required for all withdrawals.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalRequest;
