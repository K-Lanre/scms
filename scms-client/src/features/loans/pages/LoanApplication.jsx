import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiDollarSign, FiCalendar, FiPercent, FiUsers } from "react-icons/fi";
import toast from "react-hot-toast";

const LoanApplication = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      loanAmount: 50000,
      interestRate: 12,
      loanTerm: "1",
    },
  });

  const [calculation, setCalculation] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0,
  });

  const loanAmount = watch("loanAmount");
  const interestRate = watch("interestRate");
  const loanTerm = watch("loanTerm");

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const payments = parseFloat(loanTerm) * 12;

    if (principal && rate && payments) {
      const x = Math.pow(1 + rate, payments);
      const monthly = (principal * x * rate) / (x - 1);
      const totalPayment = monthly * payments;
      const totalInterest = totalPayment - principal;

      setCalculation({
        monthlyPayment: monthly.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
      });
    } else {
      setCalculation({
        monthlyPayment: 0,
        totalInterest: 0,
        totalPayment: 0,
      });
    }
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm]);

  const onSubmit = (data) => {
    console.log("Submitting Loan Application:", data);
    toast.success("Loan application submitted successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Loan Application</h1>
        <p className="text-gray-600">
          Apply for a new loan or calculate potential repayments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ... existing columns ... */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              Loan Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("loanType", {
                    required: "Loan type is required",
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow bg-white"
                >
                  <option value="">Select Loan Type</option>
                  <option value="personal">Personal Loan</option>
                  <option value="business">Business Loan</option>
                  <option value="emergency">Emergency Loan</option>
                  <option value="education">Education Loan</option>
                  <option value="agricultural">Agricultural Loan</option>
                </select>
                {errors.loanType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.loanType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Purpose <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("loanPurpose", {
                    required: "Loan purpose is required",
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow bg-white"
                >
                  <option value="">Select Purpose</option>
                  <option value="business-expansion">Business Expansion</option>
                  <option value="education">Education Fees</option>
                  <option value="medical">Medical Expenses</option>
                  <option value="home-renovation">Home Renovation</option>
                  <option value="vehicle">Vehicle Purchase</option>
                </select>
                {errors.loanPurpose && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.loanPurpose.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount (₦) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    {...register("loanAmount", {
                      required: "Loan amount is required",
                      min: { value: 1000, message: "Minimum loan is ₦1,000" },
                    })}
                    type="number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                    placeholder="50000"
                  />
                </div>
                {errors.loanAmount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.loanAmount.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (%)
                </label>
                <div className="relative">
                  <FiPercent className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    {...register("interestRate")}
                    type="number"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                    placeholder="12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term (Years) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                  <select
                    {...register("loanTerm", {
                      required: "Loan term is required",
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow bg-white"
                  >
                    <option value="">Select Term</option>
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                    <option value="5">5 Years</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 border-b pb-2">
                Collateral Information
              </h3>
              <textarea
                {...register("collateral")}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow resize-none"
                placeholder="Describe collateral offered (if any)"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              Guarantor Information
            </h2>
            <div className="space-y-6">
              {[1, 2].map((num) => (
                <div
                  key={num}
                  className="bg-gray-50 rounded-lg p-5 border border-gray-200"
                >
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-2 text-xs">
                      {num}
                    </span>
                    Guarantor {num}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      {...register(`guarantor${num}Name`)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Full Name"
                    />
                    <input
                      {...register(`guarantor${num}Phone`)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Phone Number"
                    />
                    <input
                      {...register(`guarantor${num}Email`)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Email Address"
                    />
                    <input
                      {...register(`guarantor${num}Relationship`)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Relationship"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <h2 className="text-xl font-bold mb-6 relative z-10">
              Estimation Summary
            </h2>

            <div className="space-y-5 relative z-10 text-blue-50">
              <div className="flex justify-between items-center pb-4 border-b border-blue-500/30">
                <span className="text-sm">Monthly Payment</span>
                <span className="text-3xl font-bold text-white">
                  ₦{calculation.monthlyPayment}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Interest</span>
                <span className="font-semibold">
                  ₦{calculation.totalInterest}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Repayment</span>
                <span className="font-semibold text-white">
                  ₦{calculation.totalPayment}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm">Loan Term</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-semibold">
                  {loanTerm || 0} Years
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={calculateLoan}
              className="w-full mt-8 px-4 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Update Calculation
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">
              Eligibility Check
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiUsers className="text-green-600 size-4" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 text-sm">
                    Member for 6+ months
                  </p>
                  <p className="text-xs text-gray-500">
                    Regular membership required
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiDollarSign className="text-green-600 size-4" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 text-sm">
                    Active Savings Account
                  </p>
                  <p className="text-xs text-gray-500">
                    Minimum balance maintained
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiCalendar className="text-green-600 size-4" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 text-sm">
                    No Active Defaults
                  </p>
                  <p className="text-xs text-gray-500">
                    Clear repayment history
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Submit Application</h3>
            <p className="text-gray-600 text-xs mb-6 leading-relaxed">
              By submitting this application, you agree to the terms and
              conditions and authorize the cooperative to verify your
              information.
            </p>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
            >
              Submit Loan Application
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoanApplication;
