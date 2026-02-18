import React, { useState } from "react";
import {
  FiMail,
  FiMessageSquare,
  FiSettings,
  FiPlus,
  FiEdit2,
  FiCopy,
  FiTrash2,
  FiSend,
  FiCode,
} from "react-icons/fi";

const TemplateManager = () => {
  const [activeTab, setActiveTab] = useState("email");

  const templates = [
    {
      id: "T-001",
      name: "Registration Welcome",
      type: "Email",
      status: "Active",
    },
    { id: "T-002", name: "Loan Approval Alert", type: "SMS", status: "Active" },
    {
      id: "T-003",
      name: "Payment Reminder",
      type: "Email/SMS",
      status: "Inactive",
    },
    { id: "T-004", name: "Password Reset", type: "Email", status: "System" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Communication Templates
          </h1>
          <p className="text-slate-600">
            Customize automated Email and SMS messages sent by the system.
          </p>
        </div>

        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-200">
          <FiPlus />
          <span>New Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Categories */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm">
            <button
              onClick={() => setActiveTab("email")}
              className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition-all font-bold ${activeTab === "email" ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <FiMail
                className={activeTab === "email" ? "text-blue-400" : ""}
              />
              <span>Email Templates</span>
            </button>
            <button
              onClick={() => setActiveTab("sms")}
              className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition-all font-bold ${activeTab === "sms" ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <FiMessageSquare
                className={activeTab === "sms" ? "text-blue-400" : ""}
              />
              <span>SMS Templates</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all font-bold">
              <FiSettings />
              <span>Gateway Settings</span>
            </button>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h4 className="text-blue-800 font-bold mb-3 flex items-center text-sm">
              <FiCode className="mr-2" />
              Dynamic Labels
            </h4>
            <p className="text-[10px] text-blue-700 font-bold leading-relaxed">
              Use these tags to personalize messages:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["{{user_name}}", "{{amount}}", "{{loan_id}}", "{{date}}"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white border border-blue-200 rounded-md text-[9px] font-mono font-black text-blue-600 uppercase"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Templates Grid/List */}
        <div className="lg:col-span-3 space-y-4">
          {templates.map((temp) => (
            <div
              key={temp.id}
              className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  {temp.type.includes("Email") ? (
                    <FiMail size={24} />
                  ) : (
                    <FiMessageSquare size={24} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                    {temp.name}
                  </h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {temp.id} • {temp.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        temp.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {temp.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  title="Edit Template"
                >
                  <FiEdit2 />
                </button>
                <button
                  className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  title="Duplicate"
                >
                  <FiCopy />
                </button>
                <button
                  className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  title="Send Test"
                >
                  <FiSend />
                </button>
                <button
                  className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}

          <div className="py-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
            <FiMail className="text-4xl mb-4 text-slate-200" />
            <p className="text-sm font-bold uppercase tracking-widest">
              End of Template List
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;
