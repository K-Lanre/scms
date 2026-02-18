import React from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiInfo } from "react-icons/fi";

const SavingsProducts = () => {
  const products = [
    {
      id: 1,
      name: "Regular Savings",
      interest: "5.0%",
      duration: "Flexible",
      minDeposit: "₦1,000",
      status: "Active",
    },
    {
      id: 2,
      name: "Target Savings (Xmas)",
      interest: "8.0%",
      duration: "12 Months",
      minDeposit: "₦5,000",
      status: "Active",
    },
    {
      id: 3,
      name: "High Yield Fix",
      interest: "12.0%",
      duration: "24 Months",
      minDeposit: "₦50,000",
      status: "Active",
    },
    {
      id: 4,
      name: "Education Plan",
      interest: "7.5%",
      duration: "6 Months",
      minDeposit: "₦2,000",
      status: "Inactive",
    },
  ];

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
          <h1 className="text-2xl font-bold text-gray-800">Savings Products</h1>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
          <FiPlus className="mr-2" /> Create New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden"
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
                <button className="text-gray-400 hover:text-blue-600">
                  <FiEdit2 />
                </button>
                <button className="text-gray-400 hover:text-red-600">
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              A flexible savings plan designed for consistent monthly savers.
            </p>

            <div className="space-y-3 pt-3 border-t border-gray-50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Interest Rate</span>
                <span className="font-semibold text-green-600">
                  {product.interest}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration</span>
                <span className="font-semibold text-gray-700">
                  {product.duration}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Min. Deposit</span>
                <span className="font-semibold text-gray-700">
                  {product.minDeposit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

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
