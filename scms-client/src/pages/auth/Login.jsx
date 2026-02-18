import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiMail, FiLock, FiBriefcase } from "react-icons/fi";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // Mock login logic
    let userRole = "member";
    if (data.email.includes("admin")) {
      userRole = "admin";
    } else if (data.email.includes("staff")) {
      userRole = "staff";
    }

    const userData = {
      name: data.email.split("@")[0],
      email: data.email,
      role: userRole,
    };

    login(userData, userRole);
    navigate("/dashboard");
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg transform rotate-3">
          <FiBriefcase className="text-3xl text-white transform -rotate-3" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">CoopFinance</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to manage your cooperative account
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email", { required: "Email is required" })}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.email
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-600 focus:border-blue-600"
              } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-all`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password", { required: "Password is required" })}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.password
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-600 focus:border-blue-600"
              } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-all`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900 cursor-pointer"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-md"
          >
            Sign in
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:text-blue-500 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
