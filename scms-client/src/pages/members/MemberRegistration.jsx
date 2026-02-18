import React from "react";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCamera,
  FiUploadCloud,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const MemberRegistration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
    alert("Functionality to submit form would go here.");
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Complete Your Membership
        </h1>
        <p className="text-gray-600 mt-1">
          Please provide the required details and documents to finalize your
          cooperative membership.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">
              1
            </span>
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="e.g. John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="+234 812 345 6789"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                {...register("dob", { required: "Date of birth is required" })}
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow bg-white text-gray-600"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marital Status
              </label>
              <select
                {...register("maritalStatus")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow bg-white text-gray-600"
              >
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Residential Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                <textarea
                  {...register("address", { required: "Address is required" })}
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow resize-none"
                  placeholder="Enter full residential address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Information
              </label>
              <textarea
                {...register("employment")}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow resize-none"
                placeholder="Employer Name, Position, Office Address..."
              />
            </div>
          </div>
        </section>

        {/* Document Upload */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">
              2
            </span>
            Required Documents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50/10 transition-all group cursor-pointer">
              <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <FiCamera className="text-2xl text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Passport Photo
              </h3>
              <p className="text-xs text-gray-500 mb-4">JPG, PNG (Max 2MB)</p>
              <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer transition-colors">
                <FiUploadCloud className="mr-2" /> Select File
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  {...register("passportPhoto")}
                />
              </label>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50/10 transition-all group cursor-pointer">
              <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <FiUploadCloud className="text-2xl text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Valid ID Card
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                NIN, Voter's Card, etc.
              </p>
              <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer transition-colors">
                <FiUploadCloud className="mr-2" /> Select File
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.image/*"
                  {...register("idDocument")}
                />
              </label>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50/10 transition-all group cursor-pointer">
              <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <FiUploadCloud className="text-2xl text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Utility Bill</h3>
              <p className="text-xs text-gray-500 mb-4">Proof of Address</p>
              <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer transition-colors">
                <FiUploadCloud className="mr-2" /> Select File
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.image/*"
                  {...register("addressProof")}
                />
              </label>
            </div>
          </div>
        </section>

        {/* Membership Details */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">
              3
            </span>
            Membership Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membership Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register("membershipType", {
                  required: "Membership type is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow bg-white"
              >
                <option value="">Select Type</option>
                <option value="regular">Regular</option>
                <option value="premium">Premium</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Deposit (₦) <span className="text-red-500">*</span>
              </label>
              <input
                {...register("initialDeposit", {
                  required: "Initial deposit is required",
                  min: { value: 1000, message: "Minimum deposit is ₦1,000" },
                })}
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referrer Code
              </label>
              <input
                {...register("referralCode")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <label className="flex items-start cursor-pointer group">
              <input
                type="checkbox"
                {...register("terms", {
                  required: "You must accept the terms and conditions",
                })}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                I confirm that the information provided is accurate and I agree
                to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                of the Cooperative Society.
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 ml-7 text-sm text-red-500">
                {errors.terms.message}
              </p>
            )}
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Link
            to="/members"
            className="px-8 py-3.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-100"
          >
            Complete Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberRegistration;
