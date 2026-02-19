import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiCreditCard,
  FiBarChart2,
  FiSettings,
  FiBriefcase,
  FiHelpCircle,
  FiMessageSquare,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiGrid,
  FiList,
  FiPlusCircle,
  FiActivity,
  FiShield,
  FiSliders,
  FiUserPlus,
  FiFileText,
  FiPercent,
  FiBox,
  FiMail,
  FiArrowUpRight,
} from "react-icons/fi";
import { useAuth, useLogout } from "../../../features/auth/hooks/useAuth";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { role } = useAuth();
  const { mutate: logout } = useLogout();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState({});

  const toggleMenu = (name) => {
    setExpandedMenu((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FiHome />,
      roles: ["admin", "staff", "member"],
    },
    {
      name: "Members",
      icon: <FiUsers />,
      roles: ["admin", "staff"],
      submenu: [{ name: "Directory", path: "/members", icon: <FiList /> }],
    },
    {
      name: "Onboarding",
      path: "/members/register",
      icon: <FiUserPlus />,
      roles: ["member"],
    },
    {
      name: "Savings",
      icon: <FiDollarSign />,
      roles: ["admin", "staff", "member"],
      submenu: [
        { name: "Overview", path: "/savings", icon: <FiGrid /> },
        {
          name: "Operations",
          path: "/savings/operations",
          icon: <FiActivity />,
        },
        {
          name: "Products",
          path: "/savings/products",
          icon: <FiSliders />,
          roles: ["admin"],
        }, // Admin only
        {
          name: "Withdrawal",
          path: "/savings/withdrawal",
          icon: <FiPlusCircle />,
          roles: ["member", "admin", "staff"],
        },
      ],
    },
    {
      name: "Loans",
      icon: <FiCreditCard />,
      roles: ["admin", "staff", "member"],
      submenu: [
        { name: "Apply / View", path: "/loans", icon: <FiGrid /> },
        {
          name: "Portfolio",
          path: "/loans/portfolio",
          icon: <FiBarChart2 />,
          roles: ["admin", "staff"],
        },
        {
          name: "Requests",
          path: "/loans/requests",
          icon: <FiList />,
          roles: ["admin", "staff"],
        },
        {
          name: "Repayments",
          path: "/loans/repayments",
          icon: <FiDollarSign />,
          roles: ["admin", "staff"],
        },
        {
          name: "Calculator",
          path: "/loans/calculator",
          icon: <FiPlusCircle />,
          roles: ["member", "admin", "staff"],
        },
        {
          name: "Appraisal",
          path: "/loans/appraisal",
          icon: <FiShield />,
          roles: ["admin", "staff"],
        },
        {
          name: "Collateral",
          path: "/loans/collateral",
          icon: <FiBox />,
          roles: ["admin", "staff"],
        },
      ],
    },
    {
      name: "Transactions",
      icon: <FiBriefcase />,
      roles: ["admin", "staff", "member"],
      submenu: [
        { name: "History", path: "/transactions", icon: <FiList /> },
        {
          name: "Transfer",
          path: "/transactions/transfer",
          icon: <FiActivity />,
        },
        {
          name: "New Entry",
          path: "/transactions/entry",
          icon: <FiPlusCircle />,
          roles: ["admin", "staff"],
        },
      ],
    },
    {
      name: "Reports",
      icon: <FiBarChart2 />,
      roles: ["admin", "staff"],
      submenu: [
        { name: "Overview", path: "/reports", icon: <FiGrid /> },
        {
          name: "Statements",
          path: "/reports/statements",
          icon: <FiFileText />,
        },
      ],
    },
    {
      name: "Admin",
      icon: <FiSettings />,
      roles: ["admin"],
      submenu: [
        { name: "Users", path: "/admin/users", icon: <FiUsers /> },
        { name: "Settings", path: "/admin/settings", icon: <FiSliders /> },
        { name: "Audit Logs", path: "/admin/audit", icon: <FiShield /> },
        {
          name: "Registrations",
          path: "/admin/registrations",
          icon: <FiUserPlus />,
        },
        {
          name: "Withdrawals",
          path: "/admin/withdrawals",
          icon: <FiArrowUpRight />,
        },
        {
          name: "Disbursements",
          path: "/admin/disbursements",
          icon: <FiPlusCircle />,
        },
        { name: "Chart of Accounts", path: "/admin/coa", icon: <FiFileText /> },
        {
          name: "Interest Posting",
          path: "/admin/interest",
          icon: <FiPercent />,
        },
        { name: "Templates", path: "/admin/templates", icon: <FiMail /> },
      ],
    },
  ];

  const bottomItems = [
    { name: "Support", path: "/support", icon: <FiHelpCircle /> },
    { name: "Messages", path: "/messages", icon: <FiMessageSquare /> },
  ];

  const isRoleAllowed = (allowedRoles) =>
    !allowedRoles || allowedRoles.includes(role);

  return (
    <aside
      className={`bg-slate-900 text-white transition-all duration-300 flex flex-col ${isOpen ? "w-64" : "w-20"} h-screen z-40 sticky top-0`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between h-20">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
            <FiBriefcase className="text-xl" />
          </div>
          {isOpen && (
            <div className="whitespace-nowrap animate-in fade-in duration-200">
              <h2 className="text-xl font-bold">CoopFinance</h2>
              <p className="text-gray-400 text-xs">Management System</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 overflow-y-auto custom-scrollbar pb-6">
        <div className="px-4 mb-2">
          {isOpen && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Menu
            </p>
          )}
        </div>

        <ul className="space-y-1">
          {menuItems.map((item) => {
            if (!isRoleAllowed(item.roles)) return null;

            // Filter Submenus by role
            const submenu = item.submenu?.filter((sub) =>
              isRoleAllowed(sub.roles),
            );

            // Check if active (for parent styling)
            const isActive =
              item.path === location.pathname ||
              submenu?.some((sub) => sub.path === location.pathname);

            if (submenu && submenu.length > 0) {
              return (
                <li key={item.name} className="px-3">
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${isActive ? "text-white bg-gray-800" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl">{item.icon}</span>
                      {isOpen && (
                        <span className="ml-3 font-medium">{item.name}</span>
                      )}
                    </div>
                    {isOpen &&
                      (expandedMenu[item.name] ? (
                        <FiChevronDown />
                      ) : (
                        <FiChevronRight />
                      ))}
                  </button>

                  {/* Submenu */}
                  {isOpen && expandedMenu[item.name] && (
                    <ul className="mt-1 ml-4 space-y-1 border-l-2 border-gray-700 pl-2 animate-in slide-in-from-top-2 duration-200">
                      {submenu.map((sub) => (
                        <li key={sub.name}>
                          <NavLink
                            to={sub.path}
                            className={({ isActive }) =>
                              `flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${isActive ? "text-blue-400 bg-blue-900/20 font-medium" : "text-gray-400 hover:text-white hover:bg-gray-800"}`
                            }
                          >
                            <span className="mr-3">{sub.icon}</span>
                            {sub.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.name} className="px-3">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-gray-400 hover:text-white hover:bg-gray-800"}`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  {isOpen && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="my-6 border-t border-gray-700 mx-4"></div>

        <div className="px-4 mb-2">
          {isOpen && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Help
            </p>
          )}
        </div>
        <ul className="space-y-1 px-3">
          {bottomItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 rounded-lg transition-colors ${isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`
                }
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-gray-900">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-colors rounded-lg group"
        >
          <FiLogOut className="text-xl group-hover:text-red-400" />
          {isOpen && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
