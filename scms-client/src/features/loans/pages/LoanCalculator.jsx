import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FiPieChart,
  FiCalendar,
  FiTrendingDown,
  FiInfo,
  FiArrowRight,
  FiPlusCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const LoanCalculator = () => {
  const { register, watch, setValue } = useForm({
    defaultValues: {
      amount: 100000,
      tenure: 12,
      interestRate: 15,
    },
  });

  const amount = watch("amount");
  const tenure = watch("tenure");
  const interestRate = watch("interestRate");

  const [results, setResults] = useState({
    monthly: 0,
    totalInterest: 0,
    totalPayment: 0,
  });

  useEffect(() => {
    calculateLoan();
  }, [amount, tenure, interestRate]);

  const calculateLoan = () => {
    const principal = parseFloat(amount);
    const calculatedInterest = parseFloat(interestRate) / 100 / 12;
    const calculatedPayments = parseFloat(tenure);

    // Compute monthly payment
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
      setResults({
        monthly: monthly.toFixed(2),
        totalInterest: (monthly * calculatedPayments - principal).toFixed(2),
        totalPayment: (monthly * calculatedPayments).toFixed(2),
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center md:justify-start">
          <FiPlusCircle className="mr-3 text-blue-600" />
          Loan Calculator
        </h1>
        <p className="text-slate-600 mt-2">
          Estimate your monthly repayments and total interest costs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-slate-700">
                Loan Amount (₦)
              </label>
              <span className="text-lg font-black text-blue-600">
                ₦{amount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="10000"
              {...register("amount")}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>₦10k</span>
              <span>₦5M</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-slate-700">
                Tenure (Months)
              </label>
              <span className="text-lg font-black text-blue-600">
                {tenure} Months
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              {...register("tenure")}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>1 Mo</span>
              <span>60 Mo</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-bold text-slate-700">
                Interest Rate (% p.a)
              </label>
              <span className="text-lg font-black text-blue-600">
                {interestRate}%
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="0.5"
              {...register("interestRate")}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>1%</span>
              <span>40%</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50">
            <Link
              to="/loans"
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-200"
            >
              <span>Apply for this Loan</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <FiCalendar className="text-blue-400 text-xl" />
              </div>
              <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-bold">
                Monthly Repayment
              </p>
              <h2 className="text-5xl font-black">
                ₦{Number(results.monthly).toLocaleString()}
              </h2>
            </div>
            <p className="text-slate-500 text-xs mt-8">
              Based on reducing balance interest rate calculations.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                <FiTrendingDown className="text-amber-500 text-xl" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Total Interest
                </p>
                <h3 className="text-2xl font-black text-slate-800">
                  ₦{Number(results.totalInterest).toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                <FiPieChart className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Total Repayment
                </p>
                <h3 className="text-2xl font-black text-slate-800">
                  ₦{Number(results.totalPayment).toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="mt-auto p-4 bg-blue-50 rounded-2xl flex items-start space-x-3">
              <FiInfo className="text-blue-500 mt-1 flex-shrink-0" />
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                This is an estimate. Actual loan terms may vary based on your
                membership status and credit evaluation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
