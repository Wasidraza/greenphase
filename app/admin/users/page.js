"use client";

import React, { useEffect, useState } from "react";
import AdminNav from "@/app/Components/AdminNav";
import AdminSidebar from "@/app/Components/AdminSidebar";

function UsersDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/signup"); // GET API
        const data = await res.json();

        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.message || "Failed to fetch users");
        }
      } catch (err) {
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminNav />
        <div className="p-6 lg:mt-2">
          <h2 className="mb-4 text-2xl font-bold">Users Details</h2>

          {/* Loading */}
          {loading && <p className="text-gray-500">Loading users...</p>}

          {/* Error */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Users Table */}
          {!loading && !error && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-green-600">Name</th>
                    <th className="px-4 py-2 text-left text-green-600">Email</th>
                    <th className="px-4 py-2 text-left text-green-600">Phone</th>
                    <th className="px-4 py-2 text-left text-green-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-slate-700">{u.name}</td>
                      <td className="px-4 py-2 text-slate-700">{u.email}</td>
                      <td className="px-4 py-2 text-slate-700">{u.phone || "User"}</td>
                      <td className="px-4 py-2 text-slate-700">
                        {new Date(u.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* No Users */}
          {!loading && !error && users.length === 0 && (
            <p className="text-gray-600">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersDetails;
