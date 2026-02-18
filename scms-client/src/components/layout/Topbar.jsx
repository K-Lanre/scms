import React, { useState } from "react";
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiUser,
  FiChevronDown,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Topbar = ({ setSidebarOpen, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Mock notifications
  const notifications = [
    { id: 1, title: "New loan application", time: "2 mins ago", read: false },
    {
      id: 2,
      title: "Member registration approved",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 3,
      title: "System update available",
      time: "3 hours ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section (Search & Toggle) */}
        <div className="flex items-center flex-1">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none"
          >
            <FiMenu className="text-2xl" />
          </button>

          <div className="ml-6 relative hidden md:block w-full max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search members, transactions, reports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow outline-none text-sm"
            />
          </div>
        </div>

        {/* Right Section (Notifications & Profile) */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative text-gray-600">
              <FiBell className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-700 leading-tight">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role || "Member"}
                </p>
              </div>
              <FiChevronDown
                className={`text-gray-400 transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    Signed in as
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <FiUser className="mr-3 h-4 w-4" /> My Profile
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <FiSettings className="mr-3 h-4 w-4" /> Account Settings
                  </Link>
                </div>

                <div className="py-1 border-t border-gray-100">
                  <button
                    onClick={logout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut className="mr-3 h-4 w-4" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
