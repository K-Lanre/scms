import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiSave,
  FiCamera,
} from "react-icons/fi";

const UserProfile = () => {
  const { user, role } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "+234 800 000 0000",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and security.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Card */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
                {user?.name?.charAt(0) || "U"}
              </div>
              <button className="absolute bottom-2 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors shadow-sm">
                <FiCamera size={14} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500 mb-2">{user?.email}</p>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">
              {role}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">
            Edit Details
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                  readOnly
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Contact admin to change email.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  {...register("phone")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-bold text-gray-800 mb-4">Security</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password (Optional)
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="password"
                      {...register("password")}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="password"
                      {...register("confirmPassword")}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md flex items-center transition-all"
              >
                <FiSave className="mr-2" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
