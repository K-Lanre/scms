import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiArrowRight, FiLoader } from "react-icons/fi";
import { useSignup } from "../hooks/useAuth";
import toast from "react-hot-toast";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const signupMutation = useSignup();
  const navigate = useNavigate();
  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        passwordConfirm: data.confirmPassword,
      };

      await signupMutation.mutateAsync(payload);
      toast.success(
        "Account created successfully! Please complete your onboarding.",
      );
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Create Your Account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Start your membership journey today
        </p>
      </div>

      <form
        className="space-y-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3.5 text-gray-400" />
              <input
                {...register("fullName", {
                  required: "Full Name is required",
                })}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                placeholder="e.g. John Doe"
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-gray-400" />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                type="email"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                {...register("password", {
                  required: "Required",
                  minLength: { value: 6, message: "Min 6 chars" },
                })}
                type="password"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                placeholder="••••••"
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
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                {...register("confirmPassword", {
                  required: "Required",
                  validate: (value) => value === password || "Match failed",
                })}
                type="password"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                placeholder="••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-all shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {signupMutation.isPending ? (
              <FiLoader className="animate-spin" />
            ) : (
              <>
                Create Account <FiArrowRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-all"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
