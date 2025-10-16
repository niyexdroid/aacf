"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  User,
  Key,
  Eye,
  EyeOff,
  Save,
  UserPlus,
  Trash2,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import AdminNavbar from "@/components/AdminNavbar";

interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Password change form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // New user form
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) {
          throw new Error("Not authenticated");
        }
        const data = await res.json();
        setUser(data.user);
        await fetchUsers();
      } catch (error) {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newUserEmail || !newUserPassword) {
      setError("Email and password are required");
      return;
    }

    if (newUserPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      setMessage("User created successfully!");
      setNewUserEmail("");
      setNewUserPassword("");
      setShowNewUserForm(false);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user: ${email}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      setMessage("User deleted successfully!");
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Settings
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, {user?.email}
              </div>
              <button
                onClick={() => router.push("/admin")}
                className="px-4 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <AdminNavbar />

      {/* Settings Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your admin account and users</p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Settings Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Password Management */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center space-x-3">
              <Key className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-semibold text-gray-900">
                Change Password
              </h3>
            </div>

            {!showPasswordForm ? (
              <Button
                onClick={() => setShowPasswordForm(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label
                    htmlFor="current-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-orange-500 focus:outline-none"
                      required
                      aria-required="true"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-orange-500 focus:outline-none"
                      required
                      minLength={6}
                      aria-required="true"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                    required
                    aria-required="true"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Password
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* User Management */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-6 w-6 text-orange-500" />
                <h3 className="text-xl font-semibold text-gray-900">
                  User Management
                </h3>
              </div>
              <Button
                onClick={() => setShowNewUserForm(!showNewUserForm)}
                className="bg-blue-500 hover:bg-blue-600"
                size="sm"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            {/* New User Form */}
            {showNewUserForm && (
              <form
                onSubmit={handleCreateUser}
                className="mb-6 space-y-4 border-b pb-6"
              >
                <div>
                  <label
                    htmlFor="new-user-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="new-user-email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-user-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-user-password"
                      type={showNewUserPassword ? "text" : "password"}
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-orange-500 focus:outline-none"
                      required
                      minLength={6}
                      aria-required="true"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowNewUserPassword(!showNewUserPassword)
                      }
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showNewUserPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create User
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowNewUserForm(false);
                      setNewUserEmail("");
                      setNewUserPassword("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Users List */}
            <div className="space-y-3">
              {users.map((adminUser) => (
                <div
                  key={adminUser.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {adminUser.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created:{" "}
                      {new Date(adminUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {users.length > 1 && (
                      <Button
                        onClick={() =>
                          handleDeleteUser(adminUser.id, adminUser.email)
                        }
                        className="bg-red-500 text-white hover:bg-red-600"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
