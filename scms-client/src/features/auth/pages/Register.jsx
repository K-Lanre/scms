import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiLoader,
} from "react-icons/fi";
import { useSignup } from "../hooks/useAuth";

const Register = () => {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm();

  const signupMutation = useSignup();
  const navigate = useNavigate();
  const password = watch("password", "");

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1)
      fieldsToValidate = [
        "fullName",
        "email",
        "phone",
        "password",
        "confirmPassword",
      ];
    if (step === 2) fieldsToValidate = ["dob", "gender", "address", "state"];

    const isValidStep = await trigger(fieldsToValidate);
    if (isValidStep) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data) => {
    try {
      // Map frontend fields to backend if necessary
      // Backend expects: name, email, password, passwordConfirm
      const payload = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        passwordConfirm: data.confirmPassword,
        // Optional fields for registration queue
        phoneNumber: data.phone,
        address: data.address,
        state: data.state,
        dateOfBirth: data.dob,
        // ... any others
      };

      await signupMutation.mutateAsync(payload);
      alert("Registration successful! Your application is pending approval.");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Join the Cooperative
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Complete the form below to apply for membership
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 rounded transition-all duration-300"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        ></div>

        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step >= s
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500 bg-white border-2 border-gray-200"
            }`}
          >
            {step > s ? <FiCheck /> : s}
          </div>
        ))}
      </div>

      <form
        className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Step 1: Account Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right fade-in duration-300">
            <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">
              Account Information
            </h3>
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
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  {...register("phone", {
                    required: "Phone Number is required",
                  })}
                  type="tel"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                  placeholder="+234..."
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  Confirm
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
          </div>
        )}

        {/* Step 2: Personal Info */}
        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-right fade-in duration-300">
            <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">
              Personal Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="date"
                    {...register("dob", { required: "Required" })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                  />
                </div>
                {errors.dob && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.dob.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  {...register("gender", { required: "Required" })}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Residential Address
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                <textarea
                  {...register("address", { required: "Address is required" })}
                  rows="2"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none resize-none"
                  placeholder="House Number, Street Name..."
                ></textarea>
              </div>
              {errors.address && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State of Origin
              </label>
              <input
                {...register("state", { required: "State is required" })}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                placeholder="State"
              />
              {errors.state && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Employment Info */}
        {step === 3 && (
          <div className="space-y-4 animate-in slide-in-from-right fade-in duration-300">
            <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">
              Employment & Next of Kin
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occupation
              </label>
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  {...register("occupation", { required: "Required" })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                  placeholder="e.g. Civil Servant"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employer Name (Optional)
              </label>
              <input
                {...register("employer")}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                placeholder="Employer / Business Name"
              />
            </div>

            <div className="border-t pt-2 mt-2">
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Next of Kin Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                <input
                  {...register("nokName", { required: "Required" })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="NOK Name"
                />
                <input
                  {...register("nokPhone", { required: "Required" })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="NOK Phone"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 mt-6 border-t border-gray-50">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <FiArrowLeft className="mr-2" /> Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-all shadow-md"
            >
              Next Step <FiArrowRight className="ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="flex items-center px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition-all shadow-md disabled:bg-green-400 disabled:cursor-not-allowed min-w-[160px] justify-center"
            >
              {signupMutation.isPending ? (
                <FiLoader className="animate-spin" />
              ) : (
                <>
                  Submit Application <FiCheck className="ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-blue-600 hover:text-blue-500 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
