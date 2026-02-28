import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FiArrowRight,
  FiDollarSign,
  FiInfo,
  FiCheckCircle,
  FiRefreshCw,
  FiCreditCard,
  FiUser,
  FiArrowLeft,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { getMyAccounts } from "../../accounts/services/accountApi";
import { transfer, findAccountByNumber } from "../services/transactionsApi";
import ConfirmationModal from "../../../shared/components/common/ConfirmationModal";
import toast from "react-hot-toast";

const InterAccountTransfer = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      description: "",
      toAccount: "",
    },
  });
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [isValidatingRecipient, setIsValidatingRecipient] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState(null);
  const [transferMode, setTransferMode] = useState("my_accounts"); // 'my_accounts' or 'others'

  const toAccountValue = watch("toAccount");
  const amountValue = watch("amount");
  const fromAccountValue = watch("fromAccount");

  // Debugging log (only in dev)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Form State:", {
        toAccountValue,
        amountValue,
        recipient,
        transferMode,
      });
    }
  }, [toAccountValue, amountValue, recipient, transferMode]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getMyAccounts();
        setAccounts(data);
        if (data.length > 0) {
          setValue("fromAccount", data[0].id.toString());
        }
      } catch (error) {
        toast.error("Failed to load your accounts");
      } finally {
        setIsLoadingAccounts(false);
      }
    };
    fetchAccounts();
  }, [setValue]);

  useEffect(() => {
    const validateRecipient = async () => {
      if (!toAccountValue) {
        setRecipient(null);
        return;
      }

      // Automatic lookup for 'others' mode
      if (transferMode === "others") {
        if (toAccountValue.length >= 3) {
          setIsValidatingRecipient(true);
          try {
            const data = await findAccountByNumber(toAccountValue);
            setRecipient(data);
          } catch (error) {
            setRecipient(null);
          } finally {
            setIsValidatingRecipient(false);
          }
        }
      } else if (transferMode === "my_accounts") {
        // If it's one of my accounts, fetch its name
        const myAcc = accounts.find(
          (acc) => acc.accountNumber === toAccountValue,
        );
        if (myAcc) {
          setRecipient({
            ownerName: myAcc.accountName || myAcc.accountType || "My Account",
            accountNumber: myAcc.accountNumber,
          });
        } else {
          setRecipient(null);
        }
      }
    };

    const timer = setTimeout(() => {
      validateRecipient();
    }, 500);

    return () => clearTimeout(timer);
  }, [toAccountValue, transferMode, accounts]);

  const onHandleSubmit = (data) => {
    if (!recipient) {
      toast.error("Please provide a valid destination account");
      return;
    }
    setFormData(data);
    setShowConfirm(true);
  };

  const handleTransfer = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    try {
      await transfer({
        fromAccountId: parseInt(formData.fromAccount),
        toAccountNumber: formData.toAccount,
        amount: parseFloat(formData.amount),
        description: formData.description,
      });
      toast.success("Transfer successful!");
      reset({
        amount: "",
        description: "",
        toAccount: "",
        fromAccount: formData.fromAccount, // Keep the same source account for convenience
      });
      setRecipient(null);
      // Reload accounts for updated balances
      const updatedAccounts = await getMyAccounts();
      setAccounts(updatedAccounts);
    } catch (error) {
      toast.error(error.response?.data?.message || "Transfer failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFromAccount = accounts.find(
    (acc) => acc.id.toString() === fromAccountValue,
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <Link
          to="/transactions"
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          View History
        </Link>
      </div>

      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-800">Internal Transfer</h1>
        <p className="text-gray-600">
          Move funds between your accounts or to other members.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit(onHandleSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* From Account */}
            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                Source Account
              </label>
              <div
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedFromAccount
                    ? "border-blue-100 bg-blue-50/30"
                    : "border-gray-100"
                }`}
              >
                {isLoadingAccounts ? (
                  <div className="animate-pulse h-6 bg-gray-200 rounded w-full"></div>
                ) : (
                  <select
                    {...register("fromAccount", { required: true })}
                    className="w-full bg-transparent font-bold text-gray-900 outline-none"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountName || acc.accountType} (₦
                        {parseFloat(acc.balance).toLocaleString()})
                      </option>
                    ))}
                  </select>
                )}
                <div className="mt-2 text-xs text-blue-600 font-medium">
                  {selectedFromAccount
                    ? `Available: ₦${parseFloat(
                        selectedFromAccount.balance,
                      ).toLocaleString()}`
                    : "Choose source"}
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center text-gray-300 transform scale-150">
              <FiArrowRight />
            </div>

            {/* To Account / Destination */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                  Destination
                </label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setTransferMode("my_accounts");
                      setValue("toAccount", "");
                      setRecipient(null);
                    }}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                      transferMode === "my_accounts"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    MY ACCOUNTS
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTransferMode("others");
                      setValue("toAccount", "");
                      setRecipient(null);
                    }}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                      transferMode === "others"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    OTHER MEMBERS
                  </button>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border-2 transition-all min-h-[88px] flex flex-col justify-center ${
                  recipient
                    ? "border-green-100 bg-green-50/30"
                    : errors.toAccount
                      ? "border-red-100 bg-red-50/10"
                      : "border-gray-100 hover:border-blue-200"
                } focus-within:border-blue-500`}
              >
                <div className="flex items-center">
                  {transferMode === "my_accounts" ? (
                    <select
                      {...register("toAccount", {
                        required: "Please select an account",
                      })}
                      className="w-full bg-transparent font-bold text-gray-900 outline-none"
                    >
                      <option value="">Select an account</option>
                      {accounts
                        .filter((acc) => acc.id.toString() !== fromAccountValue)
                        .map((acc) => (
                          <option key={acc.id} value={acc.accountNumber}>
                            {acc.accountName || acc.accountType} (
                            {acc.accountNumber})
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Paste or type Account No."
                      {...register("toAccount", {
                        required: "Account number is required",
                        minLength: {
                          value: 3,
                          message: "At least 3 characters",
                        },
                      })}
                      className="w-full bg-transparent font-bold text-gray-900 outline-none placeholder:text-gray-300"
                    />
                  )}

                  {isValidatingRecipient && (
                    <FiRefreshCw className="animate-spin text-blue-500 ml-2" />
                  )}
                  {recipient && (
                    <FiCheckCircle className="text-green-500 text-lg ml-2" />
                  )}
                </div>

                <div
                  className={`mt-2 text-xs font-medium ${
                    recipient
                      ? "text-green-600"
                      : errors.toAccount
                        ? "text-red-500"
                        : "text-gray-400"
                  }`}
                >
                  {recipient ? (
                    <span className="flex items-center">
                      <FiUser className="mr-1" /> {recipient.ownerName}
                    </span>
                  ) : errors.toAccount ? (
                    errors.toAccount.message
                  ) : transferMode === "others" ? (
                    "Type at least 3 digits to search..."
                  ) : (
                    "Choose which of your accounts to fund"
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
              Amount to Transfer
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center bg-gray-100 px-3 py-1 rounded-lg">
                <span className="text-gray-500 font-bold">₦</span>
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount", {
                  required: "Enter an amount",
                  min: { value: 100, message: "Minimum ₦100.00" },
                  validate: (val) =>
                    !selectedFromAccount ||
                    parseFloat(val) <=
                      parseFloat(selectedFromAccount.balance) ||
                    "Insufficient balance",
                })}
                className={`w-full pl-20 pr-4 py-4 rounded-xl border-2 outline-none text-2xl font-bold transition-all text-gray-900 ${
                  errors.amount
                    ? "border-red-200 focus:border-red-500 bg-red-50/10"
                    : "border-gray-100 focus:border-blue-500"
                }`}
              />
            </div>
            <div className="flex justify-between items-center">
              {errors.amount ? (
                <p className="text-xs text-red-500 font-bold">
                  {errors.amount.message}
                </p>
              ) : (
                <div />
              )}
              {watch("amount") && selectedFromAccount && (
                <p className="text-xs text-gray-400">
                  New Balance: ₦
                  {(
                    parseFloat(selectedFromAccount.balance) -
                    parseFloat(watch("amount") || 0)
                  ).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
              Description (Optional)
            </label>
            <textarea
              {...register("description")}
              placeholder="What's this transfer for? (e.g. For rent, School fees)"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 outline-none focus:border-blue-500 text-sm transition-all text-gray-900 h-24 resize-none"
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3 shadow-sm shadow-blue-50/50">
            <FiInfo className="text-blue-500 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
              Transfers within SCMS are **FREE** and instant. Please ensure the
              recipient account number and name match before proceeding.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !recipient || !amountValue}
            className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center space-x-2 ${
              isSubmitting || !recipient || !amountValue
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:-translate-y-1 active:translate-y-0"
            }`}
          >
            {isSubmitting ? (
              <FiRefreshCw className="animate-spin text-xl" />
            ) : (
              <FiCheckCircle className="text-xl" />
            )}
            <span className="tracking-tight text-lg">
              {isSubmitting ? "Processing Transfer..." : "Confirm & Send Money"}
            </span>
          </button>
        </form>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleTransfer}
        title="Confirm Transfer"
        message={`You are about to transfer ₦${parseFloat(
          formData?.amount || 0,
        ).toLocaleString()} to ${recipient?.ownerName} (${
          formData?.toAccount
        }). Proceed?`}
        confirmLabel="Send Money"
        type="info"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default InterAccountTransfer;
