import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  FiPieChart,
  FiCalendar,
  FiTrendingDown,
  FiInfo,
  FiArrowRight,
  FiPlusCircle,
  FiChevronDown,
  FiChevronUp,
  FiList,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const LoanCalculator = () => {
  const { register, watch } = useForm({
    defaultValues: {
      amount: 100000,
      tenure: 12,
      interestRate: 15,
    },
  });

  const amount = parseFloat(watch("amount")) || 0;
  const tenure = parseFloat(watch("tenure")) || 1;
  const interestRate = parseFloat(watch("interestRate")) || 0;

  const [showSchedule, setShowSchedule] = useState(false);

  // ── Core Calculations ──────────────────────────────────────────────────────
  const { monthly, totalInterest, totalPayment, schedule } = useMemo(() => {
    const principal = amount;
    const monthlyRate = interestRate / 100 / 12;
    const n = tenure;

    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = principal / n;
    } else {
      const x = Math.pow(1 + monthlyRate, n);
      monthlyPayment = (principal * x * monthlyRate) / (x - 1);
    }

    if (!isFinite(monthlyPayment) || monthlyPayment <= 0) {
      return { monthly: 0, totalInterest: 0, totalPayment: 0, schedule: [] };
    }

    const total = monthlyPayment * n;
    const interest = total - principal;

    // Build amortization schedule
    let balance = principal;
    const rows = [];
    for (let i = 1; i <= n; i++) {
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = monthlyPayment - interestForMonth;
      const closingBalance = Math.max(balance - principalForMonth, 0);

      rows.push({
        month: i,
        opening: balance,
        payment: monthlyPayment,
        interest: interestForMonth,
        principal: principalForMonth,
        closing: closingBalance,
      });

      balance = closingBalance;
    }

    return {
      monthly: monthlyPayment,
      totalInterest: interest,
      totalPayment: total,
      schedule: rows,
    };
  }, [amount, tenure, interestRate]);

  const fmt = (n) =>
    Number(n).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center md:justify-start">
          <FiPlusCircle className="mr-3 text-blue-600" />
          Loan Calculator
        </h1>
        <p className="text-slate-600 mt-2">
          Estimate your monthly repayments and view a full amortization
          schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Input Section ─────────────────────────────────────────────── */}
        <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
          {/* Amount */}
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

          {/* Tenure */}
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

          {/* Interest Rate */}
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

        {/* ── Results Section ────────────────────────────────────────────── */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
          {/* Monthly Payment hero */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <FiCalendar className="text-blue-400 text-xl" />
              </div>
              <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-bold">
                Monthly Repayment
              </p>
              <h2 className="text-5xl font-black">₦{fmt(monthly)}</h2>
            </div>
            <p className="text-slate-500 text-xs mt-8">
              Based on reducing balance interest rate calculations.
            </p>
          </div>

          {/* Summary card */}
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
                  ₦{fmt(totalInterest)}
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
                  ₦{fmt(totalPayment)}
                </h3>
              </div>
            </div>

            <div className="mt-auto p-4 bg-blue-50 rounded-2xl flex items-start space-x-3">
              <FiInfo className="text-blue-500 mt-1 flex-shrink-0" />
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                This is an estimate. Actual terms may vary based on your
                membership status and credit evaluation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Amortization Schedule ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <button
          onClick={() => setShowSchedule((prev) => !prev)}
          className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <FiList className="text-blue-500" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-800">
                Monthly Amortization Schedule
              </h3>
              <p className="text-xs text-slate-400">
                {tenure} payments of ₦{fmt(monthly)}
              </p>
            </div>
          </div>
          {showSchedule ? (
            <FiChevronUp className="text-slate-400 text-xl" />
          ) : (
            <FiChevronDown className="text-slate-400 text-xl" />
          )}
        </button>

        {showSchedule && (
          <div className="overflow-x-auto border-t border-slate-100">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Month</th>
                  <th className="px-6 py-3">Opening Balance</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3 text-amber-600">Interest</th>
                  <th className="px-6 py-3 text-green-600">Principal</th>
                  <th className="px-6 py-3">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {schedule.map((row) => (
                  <tr
                    key={row.month}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-3 font-bold text-slate-700">
                      {row.month}
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      ₦{fmt(row.opening)}
                    </td>
                    <td className="px-6 py-3 font-semibold text-slate-800">
                      ₦{fmt(row.payment)}
                    </td>
                    <td className="px-6 py-3 text-amber-600 font-medium">
                      ₦{fmt(row.interest)}
                    </td>
                    <td className="px-6 py-3 text-green-600 font-medium">
                      ₦{fmt(row.principal)}
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      ₦{fmt(row.closing)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                <tr>
                  <td
                    className="px-6 py-3 font-bold text-slate-700"
                    colSpan={2}
                  >
                    Totals
                  </td>
                  <td className="px-6 py-3 font-black text-slate-900">
                    ₦{fmt(totalPayment)}
                  </td>
                  <td className="px-6 py-3 font-bold text-amber-700">
                    ₦{fmt(totalInterest)}
                  </td>
                  <td className="px-6 py-3 font-bold text-green-700">
                    ₦{fmt(amount)}
                  </td>
                  <td className="px-6 py-3 font-bold text-slate-400">₦0.00</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;
