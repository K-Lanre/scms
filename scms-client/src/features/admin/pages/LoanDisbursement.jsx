import React, { useState, useEffect } from "react";
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
  FiRefreshCw,
} from "react-icons/fi";
import { getAllLoans, disburseLoan } from "../../loans/services/loansApi";
import toast from "react-hot-toast";
import { useConfirm } from "../../../contexts/ConfirmationContext";

const LoanDisbursement = () => {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const confirm = useConfirm();

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const data = await getAllLoans({ status: "approved" });
      setLoans(data.loans || []);
    } catch (err) {
      toast.error("Failed to load approved loans");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleDisburse = async (loan, mode = "automated") => {
    const isConfirmed = await confirm({
      title: "Confirm Loan Disbursement",
      message: `Are you sure you want to disburse ₦${parseFloat(loan.loanAmount).toLocaleString()} to ${loan.borrower?.name}? This will activate the repayment schedule.`,
      type: mode === "automated" ? "warning" : "info",
      confirmLabel:
        mode === "automated"
          ? "Confirm & Transfer (Paystack)"
          : "Confirm Manual Disbursement",
    });

    if (!isConfirmed) return;

    setIsProcessing(true);
    const toastId = toast.loading(`Processing ${mode} disbursement...`);

    try {
      await disburseLoan(loan.id, { mode });
      toast.success(`Loan disbursed successfully via ${mode} mode`, {
        id: toastId,
      });
      fetchLoans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Disbursement failed", {
        id: toastId,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredLoans = loans.filter(
    (loan) =>
      loan.id.toString().includes(searchTerm) ||
      loan.borrower?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Loan Disbursement
          </h1>
          <p className="text-gray-600 mt-1">
            Finalize and disburse funds for approved loan applications.
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="relative group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by ID or member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all w-64 shadow-sm"
            />
          </div>
          <button
            onClick={fetchLoans}
            disabled={isLoading}
            className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm disabled:opacity-50"
          >
            <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start space-x-4 shadow-sm">
        <div className="bg-amber-100 p-2 rounded-lg">
          <FiAlertCircle className="text-amber-700 text-xl" />
        </div>
        <div>
          <h3 className="text-amber-900 font-bold mb-1">
            Important Instruction
          </h3>
          <p className="text-amber-800 text-sm leading-relaxed opacity-90">
            Disbursing a loan will trigger an external bank transfer (if
            automated) and activate the member's repayment schedule. Ensure all
            legal documentation is finalized before proceeding.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                  Loan Details / Member
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                  Amount & Terms
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-[10px]">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-[10px] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <FiRefreshCw className="animate-spin mx-auto mb-2 text-2xl" />
                    <span className="text-sm font-medium">
                      Fetching approved loans...
                    </span>
                  </td>
                </tr>
              ) : filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4 shadow-inner">
                          <FiCreditCard className="text-xl" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 tracking-tight">
                            Loan #{loan.id}
                          </div>
                          <div className="text-sm text-gray-500 font-medium">
                            {loan.borrower?.name || "Unknown Member"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-900 text-base">
                        ₦{parseFloat(loan.loanAmount).toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-600 font-bold bg-blue-50 inline-block px-2 py-0.5 rounded-md mt-1 italic">
                        {loan.interestRate}% Interest • {loan.duration} Months
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-sm font-semibold text-gray-700">
                        <FiClock className="mr-2 text-amber-500" />
                        Approved on{" "}
                        {new Date(loan.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
                        Awaiting Fund Disbursement
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleDisburse(loan, "automated")}
                          disabled={isProcessing}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-xs font-bold shadow-md shadow-blue-200 disabled:opacity-50 active:scale-95"
                        >
                          <FiDollarSign />
                          <span>Disburse</span>
                        </button>
                        <button
                          onClick={() => handleDisburse(loan, "manual")}
                          disabled={isProcessing}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all border border-transparent hover:border-gray-200"
                          title="Manual Disbursement"
                        >
                          <FiCheckCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCheckCircle className="text-3xl text-gray-200" />
                    </div>
                    <p className="text-gray-500 font-bold">
                      No loans ready for disbursement
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Check the Appraisal/Review queue for new applications.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoanDisbursement;
