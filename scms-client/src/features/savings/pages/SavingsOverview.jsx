import React from "react";
import { Link } from "react-router-dom";
import {
  FiPlusCircle,
  FiMinusCircle,
  FiSettings,
  FiTrendingUp,
  FiDollarSign,
  FiPieChart,
  FiHome,
  FiBook,
  FiBriefcase,
  FiZap,
  FiShield,
  FiLock,
  FiFlag,
  FiCoffee,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getMySavingsPlans } from "../services/savingsApi";
import { getMyAccounts } from "../../accounts/services/accountApi";
import { getChartData } from "../../dashboard/services/dashboardApi";

const SavingsOverview = () => {
  const [savingsData, setSavingsData] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const [plansRef, accountsRef, chartRef] = await Promise.all([
          getMySavingsPlans(),
          getMyAccounts(),
          getChartData(),
        ]);

        // Standardize and merge accounts
        const mainSavings = accountsRef
          .filter((acc) => acc.accountType === "savings")
          .map((acc) => ({
            id: `main-${acc.id}`,
            name: "Main Savings",
            balance: acc.balance,
            accumulatedInterest: 0, // Main savings might not track this separately in this UI
            status: acc.status,
            type: "main",
          }));

        const targetPlans = plansRef.map((plan) => ({
          id: `plan-${plan.id}`,
          name: plan.product?.name || "Target Savings",
          balance: plan.account?.balance || plan.balance,
          accumulatedInterest: plan.accumulatedInterest || 0,
          status: plan.status,
          planName: plan.planName,
          withdrawalRequestedAt: plan.withdrawalRequestedAt,
          type: "plan",
          productType: plan.product?.type || "target",
          category: plan.product?.category || "none",
        }));

        setAccounts([...mainSavings, ...targetPlans]);

        setSavingsData(
          chartRef.data.map((item) => ({
            month: item.name,
            amount: item.savings,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch savings overview:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOverviewData();
  }, []);

  const totalBalance = accounts.reduce(
    (acc, plan) => acc + parseFloat(plan.balance || 0),
    0,
  );
  const totalInterest = accounts.reduce(
    (acc, plan) => acc + parseFloat(plan.accumulatedInterest || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Savings Overview</h1>
          <p className="text-gray-600">
            Manage your savings portfolio and transactions
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/savings/operations"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FiPlusCircle className="mr-2" /> Operations
          </Link>
          <Link
            to="/savings/products"
            className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FiSettings className="mr-2" /> Products
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <FiDollarSign className="text-xl" />
            </div>
          </div>
          <h3 className="text-3xl font-bold">
            ₦{totalBalance.toLocaleString()}
          </h3>
          <p className="text-blue-100 text-sm mt-1">Total Savings Balance</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <FiTrendingUp className="text-xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            ₦{totalInterest.toLocaleString()}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Total Interest Earned</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <FiPieChart className="text-xl" />
            </div>
            <span className="text-xs font-semibold bg-purple-50 text-purple-600 px-2 py-1 rounded">
              {accounts.filter((a) => a.status === "active").length} Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {accounts.length} Accounts
          </h3>
          <p className="text-gray-500 text-sm mt-1">Total Savings Plans</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Savings Growth
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(val) => `₦${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Account List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Your Accounts
          </h3>
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center text-gray-400 font-medium py-4">
                Loading accounts...
              </p>
            ) : accounts.length > 0 ? (
              accounts.map((acc) => (
                <Link
                  key={acc.id}
                  to={
                    acc.type === "plan"
                      ? `/savings/plans/${acc.id.replace("plan-", "")}`
                      : "#"
                  }
                  className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors flex items-center group"
                >
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg mr-4 shadow-sm transition-transform group-hover:scale-110 ${
                      acc.productType === "safebox"
                        ? "bg-orange-50 text-orange-600"
                        : acc.productType === "fixed"
                          ? "bg-purple-50 text-purple-600"
                          : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {acc.category === "rent" && <FiHome />}
                    {acc.category === "education" && <FiBook />}
                    {acc.category === "business" && <FiBriefcase />}
                    {acc.category === "emergency" && <FiZap />}
                    {acc.category === "festive" && <FiCoffee />}
                    {acc.category === "none" &&
                      (acc.productType === "safebox" ? (
                        <FiShield />
                      ) : acc.productType === "fixed" ? (
                        <FiLock />
                      ) : (
                        <FiFlag />
                      ))}
                    {acc.type === "main" && <FiDollarSign />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                        {acc.planName || acc.name}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          acc.withdrawalRequestedAt
                            ? "bg-amber-50 text-amber-600 animate-pulse"
                            : acc.status === "active"
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {acc.withdrawalRequestedAt
                          ? "PENDING (24H)"
                          : acc.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-400 uppercase">
                          Balance
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ₦{parseFloat(acc.balance).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase">
                          Interest
                        </p>
                        <p className="text-sm font-medium text-green-600">
                          +₦
                          {parseFloat(acc.accumulatedInterest).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-400 font-medium py-4">
                No active savings plans found.
              </p>
            )}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
            View All Accounts
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavingsOverview;
