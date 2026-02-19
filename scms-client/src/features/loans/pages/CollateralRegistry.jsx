import React, { useState } from "react";
import {
  FiBox,
  FiMapPin,
  FiCamera,
  FiPlus,
  FiSearch,
  FiHash,
  FiPaperclip,
  FiMoreVertical,
} from "react-icons/fi";

const CollateralRegistry = () => {
  const [items, setItems] = useState([
    {
      id: "COL-001",
      type: "Vehicle",
      description: "Toyota Corolla 2018",
      value: "₦4,500,000",
      member: "Alice Johnson",
      status: "Verified",
    },
    {
      id: "COL-002",
      type: "Land",
      description: "Plot 45, Lekki Phase 1",
      value: "₦15,000,000",
      member: "Bob Smith",
      status: "In Inspection",
    },
    {
      id: "COL-003",
      type: "Equipment",
      description: "Industrial Printer X-200",
      value: "₦850,000",
      member: "Charlie Davis",
      status: "Verified",
    },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Collateral Registry
          </h1>
          <p className="text-slate-600">
            Track and manage assets pledged as security for loans.
          </p>
        </div>

        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-200">
          <FiPlus />
          <span>Register New Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl font-bold">
            <FiBox />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
              Total Assets
            </p>
            <h3 className="text-2xl font-black text-slate-800">32</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 text-xl font-bold">
            <FiShield />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
              Covered Value
            </p>
            <h3 className="text-2xl font-black text-slate-800">₦82.4M</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 text-xl font-bold">
            <FiAlertTriangle />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
              In Inspection
            </p>
            <h3 className="text-2xl font-black text-slate-800">5</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by member, asset type or ID..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest">
              All Assets
            </button>
            <button className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg uppercase tracking-widest">
              Verified Only
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-4">Asset Detail</th>
                <th className="px-8 py-4">Estimated Value</th>
                <th className="px-8 py-4">Linked Member</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/30 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                        {item.type === "Vehicle" ? (
                          <FiHash />
                        ) : item.type === "Land" ? (
                          <FiMapPin />
                        ) : (
                          <FiBox />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">
                          {item.description}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                          {item.id} • {item.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900">
                      {item.value}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-600">
                      {item.member}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        item.status === "Verified"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <FiPaperclip />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <FiCamera />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-800 rounded-lg">
                        <FiMoreVertical />
                      </button>
                    </div>
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

export default CollateralRegistry;
