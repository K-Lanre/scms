import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiInfo,
  FiX,
  FiCheck,
  FiPercent,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import toast from "react-hot-toast";

const SavingsProducts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isModalOpen) {
      reset(
        editingProduct || {
          name: "",
          interest: "",
          minDeposit: "",
          duration: "Flexible",
        },
      );
    }
  }, [isModalOpen, editingProduct, reset]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Regular Savings",
      interest: 5.0,
      duration: "Flexible",
      minDeposit: 1000,
      status: "Active",
      description: "A flexible savings plan for consistent savers.",
    },
    {
      id: 2,
      name: "Target Savings (Xmas)",
      interest: 8.0,
      duration: "12 Months",
      minDeposit: 5000,
      status: "Active",
      description: "Save for the holiday season with higher interest.",
    },
    {
      id: 3,
      name: "High Yield Fix",
      interest: 12.0,
      duration: "24 Months",
      minDeposit: 50000,
      status: "Active",
      description: "Fixed deposit plan with maximum returns.",
    },
    {
      id: 4,
      name: "Education Plan",
      interest: 7.5,
      duration: "6 Months",
      minDeposit: 2000,
      status: "Inactive",
      description: "Secure your child's future with steady growth.",
    },
  ]);

  const openModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link
            to="/savings"
            className="text-sm text-blue-600 hover:underline mb-1 inline-block"
          >
            &larr; Back to Overview
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Savings Products Manager
          </h1>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-bold"
        >
          <FiPlus className="mr-2" /> Create New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden ${product.status === "Inactive" ? "opacity-75" : ""}`}
          >
            {product.status === "Inactive" && (
              <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-bl-lg font-bold">
                INACTIVE
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-xl font-bold">
                {product.name.charAt(0)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(product)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FiEdit2 />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {product.description}
            </p>

            <div className="space-y-3 pt-3 border-t border-gray-50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center">
                  <FiPercent className="mr-1.5" /> Interest Rate
                </span>
                <span className="font-semibold text-green-600">
                  {product.interest}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center">
                  <FiClock className="mr-1.5" /> Duration
                </span>
                <span className="font-semibold text-gray-700">
                  {product.duration}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center">
                  <FiDollarSign className="mr-1.5" /> Min. Deposit
                </span>
                <span className="font-semibold text-gray-700">
                  ₦{product.minDeposit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Basic Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-800 text-lg">
                {editingProduct ? "Edit Product" : "New Savings Product"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
              >
                <FiX />
              </button>
            </div>
            <form
              onSubmit={handleSubmit((data) => {
                console.log("Form Data:", data);
                // In a real app, call mutation here
                if (editingProduct) {
                  setProducts((prev) =>
                    prev.map((p) =>
                      p.id === editingProduct.id ? { ...p, ...data } : p,
                    ),
                  );
                  toast.success("Savings product updated!");
                } else {
                  setProducts((prev) => [
                    ...prev,
                    { ...data, id: Date.now(), status: "Active" },
                  ]);
                  toast.success("Savings product created!");
                }
                closeModal();
              })}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className={`w-full px-4 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                  placeholder="e.g. Fixed Deposit"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register("interest", {
                      required: "Required",
                      min: { value: 0, message: "Min 0" },
                    })}
                    className={`w-full px-4 py-2 border ${errors.interest ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    placeholder="5.0"
                  />
                  {errors.interest && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.interest.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Min. Deposit (₦)
                  </label>
                  <input
                    type="number"
                    {...register("minDeposit", {
                      required: "Required",
                      min: { value: 0, message: "Min 0" },
                    })}
                    className={`w-full px-4 py-2 border ${errors.minDeposit ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    placeholder="1000"
                  />
                  {errors.minDeposit && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.minDeposit.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Duration / Type
                </label>
                <select
                  {...register("duration")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option>Flexible</option>
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>12 Months</option>
                  <option>24 Months</option>
                </select>
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
        <FiInfo className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          <strong>Administrator Note:</strong> Deactivating a savings product
          will prevent new members from subscribing to it, but existing
          subscriptions will continue until maturity.
        </p>
      </div>
    </div>
  );
};

export default SavingsProducts;
