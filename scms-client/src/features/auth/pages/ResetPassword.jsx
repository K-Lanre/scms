import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useResetPassword } from "../hooks/useAuth";
import { FiLock, FiCheck, FiLoader, FiBriefcase } from "react-icons/fi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password: data.password,
        passwordConfirm: data.confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Password reset failed:", err);
    }
  };

  if (success) {
    return (
      <div className="text-center w-full">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
          <FiCheck className="text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Password Reset Successful
        </h2>
        <p className="text-gray-600 mb-8">
          Your password has been changed successfully. You will be redirected to
          the login page shortly.
        </p>
        <Link
          to="/login"
          className="w-full block py-3 px-4 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg transform rotate-3">
          <FiBriefcase className="text-3xl text-white transform -rotate-3" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your new password below.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
              type="password"
              placeholder="••••••••"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              type="password"
              placeholder="••••••••"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-600 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {resetPasswordMutation.isError && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
            {resetPasswordMutation.error?.response?.data?.message ||
              "Invalid or expired token"}
          </div>
        )}

        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400"
        >
          {resetPasswordMutation.isPending ? (
            <FiLoader className="animate-spin h-5 w-5" />
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
