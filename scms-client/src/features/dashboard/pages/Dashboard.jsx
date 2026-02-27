import React from "react";
import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiCreditCard,
  FiActivity,
  FiCalendar,
  FiAlertCircle,
  FiClock,
  FiUserPlus,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../auth/hooks/useAuth";
import { Link } from "react-router-dom";
import { getDashboardStats, getChartData } from "../services/dashboardApi";

const Dashboard = () => {
  const { user, role } = useAuth();
  const [statsData, setStatsData] = React.useState(null);
  const [chartData, setChartData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          getDashboardStats(),
          getChartData(),
        ]);
        setStatsData(statsRes.data);
        setChartData(chartRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const isAdmin =
    role === "admin" || role === "super_admin" || role === "staff";

  /* Admin Stats */
  const adminStats = [
    {
      title: "Total Members",
      value: statsData?.totalMembers || "...",
      icon: <FiUsers />,
      change: "System Total",
      color: "blue",
    },
    {
      title: "Active Loans",
      value: statsData?.totalLoansVolume || "...",
      icon: <FiCreditCard />,
      change: "Principal sum",
      color: "orange",
    },
    {
      title: "Pending Actions",
      value: statsData?.pendingActions || "0",
      icon: <FiClock />,
      change: "Tasks for review",
      color: "purple",
    },
    {
      title: "Defaulters",
      value: statsData?.defaulters || "0",
      icon: <FiAlertCircle />,
      change: statsData?.defaulters > 0 ? "Critical" : "Good standing",
      color: "red",
    },
  ];

  /* Member Stats */
  const memberStats = [
    {
      title: "My Savings",
      value: statsData?.mySavings || "...",
      icon: <FiDollarSign />,
      change: "Total balance",
      color: "green",
    },
    {
      title: "Loan Balance",
      value: statsData?.loanBalance || "...",
      icon: <FiCreditCard />,
      change: "Outstanding sum",
      color: "orange",
    },
    {
      title: "Shares",
      value: statsData?.shares || "...",
      icon: <FiTrendingUp />,
      change: "Share capital",
      color: "blue",
    },
  ];

  const stats = isAdmin ? adminStats : memberStats;

  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-400">Loading Dashboard...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isAdmin
              ? "Admin Dashboard"
              : `Welcome back, ${user?.name || "Member"}!`}
          </h1>
          <p className="text-gray-600">
            {isAdmin
              ? "System overview and performance metrics."
              : "Here is your financial summary."}
          </p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center shadow-sm">
          <FiCalendar className="mr-2" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div
                className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}
              >
                <span className="text-xl">{stat.icon}</span>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.change.includes("System") ||
                  stat.change.includes("Total")
                    ? "bg-green-50 text-green-600"
                    : stat.change.includes("Critical") ||
                        stat.change.includes("-")
                      ? "bg-red-50 text-red-600"
                      : "bg-purple-50 text-purple-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Charts Section */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Financial Overview
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Legend />
                  <Bar dataKey="savings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="loans" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Pending Actions
            </h3>
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start space-x-3">
                <div className="p-2 bg-white rounded-full text-red-500 shadow-sm">
                  <FiAlertCircle />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">
                    2 Loan Defaults
                  </h4>
                  <Link
                    to="/loans/portfolio"
                    className="text-xs text-red-600 hover:underline"
                  >
                    View Portfolio &rarr;
                  </Link>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start space-x-3">
                <div className="p-2 bg-white rounded-full text-blue-500 shadow-sm">
                  <FiUserPlus />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">
                    5 New Registrations
                  </h4>
                  <p className="text-xs text-gray-500">Pending approval</p>
                  <Link
                    to="/admin/users"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Review &rarr;
                  </Link>
                </div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg flex items-start space-x-3">
                <div className="p-2 bg-white rounded-full text-purple-500 shadow-sm">
                  <FiCreditCard />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">
                    10 Loan Requests
                  </h4>
                  <p className="text-xs text-gray-500">Awaiting processing</p>
                  <Link
                    to="/loans/requests"
                    className="text-xs text-purple-600 hover:underline"
                  >
                    Go to Queue &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member Recent Transactions Section */}
      {role === "member" && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Recent Transactions
            </h3>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
                  <th className="pb-3 px-2">Type</th>
                  <th className="pb-3 px-2">Description</th>
                  <th className="pb-3 px-2">Date</th>
                  <th className="pb-3 px-2 text-right">Amount</th>
                  <th className="pb-3 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {statsData?.recentTransactions?.length > 0 ? (
                  statsData.recentTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-3 px-2">
                        <span
                          className={`${
                            tx.transactionType === "deposit" ||
                            tx.transactionType === "savings_contribution" ||
                            tx.transactionType === "loan_disbursement"
                              ? "text-green-600 bg-green-50"
                              : "text-red-600 bg-red-50"
                          } font-bold px-2 py-1 rounded text-xs`}
                        >
                          {tx.transactionType.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-medium text-gray-700">
                        {tx.description}
                      </td>
                      <td className="py-3 px-2 text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-gray-900">
                        ₦{parseFloat(tx.amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            tx.status === "completed"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          } inline-block`}
                        ></span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-10 text-center text-gray-400 italic"
                    >
                      No recent transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
