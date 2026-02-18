import React, { useState } from "react";
import {
  FiSave,
  FiRefreshCw,
  FiDollarSign,
  FiPercent,
  FiSettings,
  FiMail,
} from "react-icons/fi";

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          System Configuration
        </h1>
        <p className="text-gray-600">
          Manage application settings and variables.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation for Settings */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setActiveTab("general")}
              className={`w-full text-left px-5 py-3 flex items-center font-medium transition-colors ${activeTab === "general" ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <FiSettings className="mr-3" /> General
            </button>
            <button
              onClick={() => setActiveTab("financial")}
              className={`w-full text-left px-5 py-3 flex items-center font-medium transition-colors ${activeTab === "financial" ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <FiPercent className="mr-3" /> Financial Params
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full text-left px-5 py-3 flex items-center font-medium transition-colors ${activeTab === "notifications" ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <FiMail className="mr-3" /> Notifications
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
                General Settings
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cooperative Name
                </label>
                <input
                  type="text"
                  defaultValue="CoopFinance Society"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  defaultValue="RC-12345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Currency
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white outline-none">
                  <option value="NGN">Nigerian Naira (₦)</option>
                  <option value="USD">US Dollar ($)</option>
                </select>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm flex items-center">
                <FiSave className="mr-2" /> Save Changes
              </button>
            </div>
          )}

          {activeTab === "financial" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
                Financial Parameters
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Loan Interest Rate (Annual %)
                </label>
                <input
                  type="number"
                  defaultValue="15.0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Loan Amount (₦)
                </label>
                <input
                  type="number"
                  defaultValue="5000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penalty for Late Repayment (% per month)
                </label>
                <input
                  type="number"
                  defaultValue="2.0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm flex items-center">
                <FiSave className="mr-2" /> Update Parameters
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
                Notification Preferences
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email Alerts</h4>
                  <p className="text-sm text-gray-500">
                    Send emails for transaction activities
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-green-500 rounded-full cursor-pointer">
                  <span className="absolute left-6 inline-block w-6 h-6 bg-white border border-gray-300 rounded-full shadow transform transition-transform duration-200 ease-in-out"></span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    SMS Notifications
                  </h4>
                  <p className="text-sm text-gray-500">
                    Send SMS text messages
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-gray-200 rounded-full cursor-pointer">
                  <span className="absolute left-0 inline-block w-6 h-6 bg-white border border-gray-300 rounded-full shadow transform transition-transform duration-200 ease-in-out"></span>
                </div>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm flex items-center">
                <FiSave className="mr-2" /> Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
