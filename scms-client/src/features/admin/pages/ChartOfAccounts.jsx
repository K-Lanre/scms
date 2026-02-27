import { getChartOfAccounts } from "../services/coaApi";
import toast from "react-hot-toast";

const ChartOfAccounts = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getChartOfAccounts();
        setAccounts(res.data);
      } catch (err) {
        toast.error("Failed to load Chart of Accounts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAccounts = accounts.filter((acc) => {
    if (activeTab === "all") return true;
    return (
      acc.type.toLowerCase() === activeTab.slice(0, -1) ||
      (acc.type === "Header" && acc.name.toLowerCase().includes(activeTab))
    );
  });

  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-400">
        Loading Chart of Accounts...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Chart of Accounts
          </h1>
          <p className="text-slate-600">
            Define and manage your general ledger structure.
          </p>
        </div>

        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-200">
          <FiPlus />
          <span>New Account</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit">
            {[
              "all",
              "assets",
              "liabilities",
              "equity",
              "income",
              "expenses",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab
                    ? "bg-slate-800 text-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm w-full md:w-64"
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
              <FiFilter />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Account Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Balance</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.map((acc) => (
                <tr
                  key={acc.code}
                  className={`hover:bg-slate-50/50 transition-colors ${acc.type === "Header" ? "bg-slate-50/30" : ""}`}
                >
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">
                    {acc.code}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {acc.type === "Header" ? (
                        <FiFolder className="text-blue-500" />
                      ) : (
                        <FiFileText className="text-slate-400" />
                      )}
                      <span
                        className={`font-bold text-slate-800 ${acc.type === "Header" ? "" : "ml-4"}`}
                      >
                        {acc.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-bold ${
                        acc.type === "Header"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {acc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {acc.balance}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase">
                        <FiCheckCircle size={10} />
                        <span>Enabled</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <FiArrowRight />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChartOfAccounts;
