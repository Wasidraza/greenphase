"use client";

import React, { useEffect, useState } from "react";
import AdminNav from "@/app/Components/AdminNav";
import AdminSidebar from "@/app/Components/AdminSidebar";

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch("/api/enquiry"); // GET API
        const data = await res.json();

        if (data.success) {
          setEnquiries(data.enquiries);
        } else {
          setError(data.error || "Failed to fetch enquiries");
        }
      } catch (err) {
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminNav />
        <div className="p-6 lg:mt-2">
          <h2 className="mb-4 text-2xl font-bold">Enquiries details</h2>

          {/* Loading */}
          {loading && <p className="text-gray-500">Loading enquiries...</p>}

          {/* Error */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Enquiries Table */}
          {!loading && !error && enquiries.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-green-600">Name</th>
                    <th className="px-4 py-2 text-left text-green-600">Email</th>
                    <th className="px-4 py-2 text-left text-green-600">City</th>
                    <th className="px-4 py-2 text-left text-green-600">Phone</th>
                    <th className="px-4 py-2 text-left text-green-600">Message</th>
                    <th className="px-4 py-2 text-left text-green-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((e) => (
                    <tr key={e._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-slate-700">{e.name}</td>
                      <td className="px-4 py-2 text-slate-700">{e.email}</td>
                      <td className="px-4 py-2 text-slate-700">{e.city}</td>
                      <td className="px-4 py-2 text-slate-700">{e.phone}</td>
                      <td className="px-4 py-2 text-slate-700">{e.message || "-"}</td>
                      <td className="px-4 py-2 text-slate-700">
                        {new Date(e.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* No Enquiries */}
          {!loading && !error && enquiries.length === 0 && (
            <p className="text-gray-600">No enquiries found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Enquiries;
