"use client";

import React, { useEffect, useState } from "react";
import AdminNav from "@/app/Components/AdminNav";
import AdminSidebar from "@/app/Components/AdminSidebar";

function UserContact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/contact"); 
        const data = await res.json();

        if (data.success) {
          setContacts(data.contacts);
        } else {
          setError(data.error || "Failed to fetch contacts");
        }
      } catch (err) {
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminNav />
        <div className="p-6 lg:mt-2">
          <h2 className="mb-4 text-2xl font-bold">Contact details</h2>

          {/* Loading State */}
          {loading && <p className="text-gray-500">Loading contacts...</p>}

          {/* Error State */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Contacts Table */}
          {!loading && !error && contacts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-green-600">Name</th>
                    <th className="px-4 py-2 text-left text-green-600">Email</th>
                    <th className="px-4 py-2 text-left text-green-600">Phone</th>
                    <th className="px-4 py-2 text-left text-green-600">Message</th>
                    <th className="px-4 py-2 text-left text-green-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-slate-700">{c.name}</td>
                      <td className="px-4 py-2 text-slate-700">{c.email}</td>
                      <td className="px-4 py-2 text-slate-700">{c.phone}</td>
                      <td className="px-4 py-2 text-slate-700">{c.message}</td>
                      <td className="px-4 py-2 text-slate-700">
                        {new Date(c.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* No Contacts */}
          {!loading && !error && contacts.length === 0 && (
            <p className="text-gray-600">No contacts found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserContact;
