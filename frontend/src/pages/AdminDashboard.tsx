import React, { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  Star,
  AlertCircle,
  CheckCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import { adminAPI } from "../services/api";
import type { ServiceProvider, Review, User, Report } from "../types";

interface ApiUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  workerProfile?: {
    isApproved: boolean;
    jobCategories: string[];
    hourlyRate: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<
    "users" | "workers" | "stats"
  >("users");
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [pendingWorkers, setPendingWorkers] = useState<ApiUser[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, workersRes, statsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getPendingWorkers(),
        adminAPI.getStats(),
      ]);
      setUsers(usersRes.data.users || []);
      setPendingWorkers(workersRes.data.workers || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      await adminAPI.updateUserStatus(userId, { isActive: !currentStatus });
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update user status");
    }
  };

  const handleEditUser = (user: ApiUser) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await adminAPI.updateUser(editingUser._id, editForm);
      setShowEditModal(false);
      setEditingUser(null);
      await fetchData();
      alert("User updated successfully");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await adminAPI.deleteUser(userId);
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleApproveWorker = async (workerId: string, approve: boolean) => {
    try {
      await adminAPI.updateWorkerApproval(workerId, { isApproved: approve });
      await fetchData();
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Failed to update worker approval"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Manage users, services, and platform operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">
                Total Users
              </h3>
              <Users className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats?.totalUsers || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Workers</h3>
              <Briefcase className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats?.totalWorkers || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">
                Approved Workers
              </h3>
              <CheckCircle className="text-yellow-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats?.approvedWorkers || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">
                Pending Workers
              </h3>
              <Star className="text-yellow-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats?.pendingWorkers || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">
                Total Bookings
              </h3>
              <AlertCircle className="text-red-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats?.totalBookings || 0}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-slate-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === "users"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setActiveTab("workers")}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === "workers"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Pending Workers
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === "stats"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Statistics
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Phone
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-slate-900">
                          {user.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {user.phone || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              user.role === "worker"
                                ? "bg-blue-100 text-blue-700"
                                : user.role === "admin"
                                ? "bg-yellow-100 text-orange-600"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              user.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Edit User"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleUserStatus(user._id, user.isActive)
                              }
                              className="text-yellow-600 hover:text-yellow-700"
                              title={user.isActive ? "Deactivate" : "Activate"}
                            >
                              {user.isActive ? "🔒" : "🔓"}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Workers Tab */}
            {activeTab === "workers" && (
              <div className="overflow-x-auto">
                <h2 className="text-xl font-semibold mb-4">
                  Pending Worker Approvals
                </h2>
                {pendingWorkers.length === 0 ? (
                  <p className="text-slate-600 py-8 text-center">
                    No pending worker approvals
                  </p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                          Categories
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                          Hourly Rate
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingWorkers.map((worker) => (
                        <tr
                          key={worker._id}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >
                          <td className="py-3 px-4 text-sm font-medium text-slate-900">
                            {worker.name}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {worker.email}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {worker.workerProfile?.jobCategories?.join(", ") ||
                              "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            ₹{worker.workerProfile?.hourlyRate || 0}/hr
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleApproveWorker(worker._id, true)
                                }
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleApproveWorker(worker._id, false)
                                }
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4">
                    User Statistics
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Users:</span>
                      <span className="font-medium">
                        {stats?.totalUsers || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Verified Users:</span>
                      <span className="font-medium">
                        {stats?.verifiedUsers || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Active Users:</span>
                      <span className="font-medium">
                        {stats?.activeUsers || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4">
                    Worker Statistics
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Workers:</span>
                      <span className="font-medium">
                        {stats?.totalWorkers || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Approved Workers:</span>
                      <span className="font-medium">
                        {stats?.approvedWorkers || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pending Approval:</span>
                      <span className="font-medium">
                        {stats?.pendingWorkers || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Edit User</h2>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  >
                    <option value="user">User</option>
                    <option value="worker">Worker</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
                    }}
                    className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

