import React, { useState } from "react";
import { FiPlus, FiShield, FiUser } from "react-icons/fi";
import { useUsers, useAdminUpdateUser } from "../hooks/useAdmin";
import ManagementDirectory from "../../../shared/components/common/ManagementDirectory";
import UserActionMenu from "../../../shared/components/common/UserActionMenu";
import UserActionForm from "../../../shared/components/common/UserActionForm";
import UserDetailsModal from "../../../shared/components/common/UserDetailsModal";
import UserEditModal from "../../../shared/components/common/UserEditModal";
import UserFinancialsModal from "../../../shared/components/common/UserFinancialsModal";

const UserManagement = () => {
  const { data: users = [], isLoading, isError } = useUsers();
  const updateUserMutation = useAdminUpdateUser();

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [financialUser, setFinancialUser] = useState(null);

  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleUpdateRole = (user, newRole) => {
    if (
      window.confirm(
        `Are you sure you want to promote ${user.name} to ${newRole.replace(/_/g, " ")}?`,
      )
    ) {
      updateUserMutation.mutate({
        userId: user.id,
        updateData: { role: newRole },
      });
    }
  };

  const handleUpdateStatus = (user, newStatus) => {
    if (
      window.confirm(
        `Are you sure you want to change ${user.name}'s status to ${newStatus}?`,
      )
    ) {
      updateUserMutation.mutate({
        userId: user.id,
        updateData: { status: newStatus },
      });
    }
  };

  const columns = [
    {
      header: "User",
      accessor: "name",
      render: (user) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex flex-shrink-0 items-center justify-center text-blue-600 font-bold overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
            {user.profilePicture ? (
              <img
                src={`${import.meta.env.VITE_API_URL}/img/users/${user.profilePicture}`}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser className="text-xl opacity-70" />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-bold text-gray-900 tracking-tight">
              {user.name}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      render: (user) => (
        <div className="flex items-center text-sm text-gray-700 font-medium">
          <FiShield
            className={`mr-2 ${user.role === "super_admin" ? "text-purple-500" : user.role === "staff" ? "text-blue-500" : "text-gray-400"}`}
          />
          <span className="capitalize">{user.role.replace("_", " ")}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (user) => (
        <span
          className={`px-3 py-1 inline-flex text-xs font-bold rounded-full capitalize shadow-sm border ${
            user.status === "active"
              ? "bg-green-50 text-green-700 border-green-200"
              : user.status === "pending_approval" ||
                  user.status === "pending_onboarding"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {user.status.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Registered",
      accessor: "createdAt",
      render: (user) => (
        <span className="text-sm text-gray-600 font-medium">
          {new Date(user.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      align: "right",
      render: (user) => (
        <div className="flex justify-end">
          <UserActionMenu
            user={user}
            onViewProfile={() => setViewingUser(user)}
            onEdit={() => setEditingUser(user)}
            onViewFinancials={() => setFinancialUser(user)}
            onSuspend={() => handleUpdateStatus(user, "suspended")}
            onActivate={() => handleUpdateStatus(user, "active")}
            onMakeAdmin={() => handleUpdateRole(user, "super_admin")}
            onMakeStaff={() => handleUpdateRole(user, "staff")}
            onMakeMember={() => handleUpdateRole(user, "member")}
          />
        </div>
      ),
    },
  ];

  const filteredData = users.filter((user) => {
    if (roleFilter !== "all" && user.role !== roleFilter) return false;
    if (statusFilter !== "all" && user.status !== statusFilter) return false;
    return true;
  });

  const filterNodes = (
    <div className="flex space-x-3 w-full">
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors cursor-pointer font-medium text-gray-700 shadow-sm"
      >
        <option value="all">All Roles</option>
        <option value="super_admin">Admin</option>
        <option value="staff">Staff</option>
        <option value="member">Member</option>
        <option value="user">User (Basic)</option>
      </select>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors cursor-pointer font-medium text-gray-700 shadow-sm"
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="pending_onboarding">Pending Onboarding</option>
        <option value="pending_approval">Pending Approval</option>
        <option value="suspended">Suspended</option>
      </select>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <ManagementDirectory
        title="User & Member Management"
        description="Unified centralized hub to manage system users, staff, and cooperative members."
        primaryAction={{
          label: "Add New User",
          icon: <FiPlus />,
          onClick: () => setIsAddFormOpen(true),
        }}
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        searchKeys={["name", "email"]}
        filterNodes={filterNodes}
        emptyMessage="No users found matching the criteria."
      />

      {isAddFormOpen && (
        <UserActionForm onClose={() => setIsAddFormOpen(false)} />
      )}

      {viewingUser && (
        <UserDetailsModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}

      {financialUser && (
        <UserFinancialsModal
          user={financialUser}
          onClose={() => setFinancialUser(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;
