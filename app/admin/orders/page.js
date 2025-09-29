"use client";

import AdminNav from "@/app/Components/AdminNav";
import AdminSidebar from "@/app/Components/AdminSidebar";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error while fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="px-3 py-1 text-sm text-green-400 bg-green-200 rounded-full">
            SUCCESS
          </span>
        );
      case "FAILED":
        return (
          <span className="px-3 py-1 text-sm text-red-400 bg-red-100 rounded-full">
            FAILED
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="px-3 py-1 text-sm font-normal text-yellow-500 bg-yellow-100 rounded-full">
            PENDING
          </span>
        );
    }
  };

  return (
    <>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminNav />
          <div className="p-6 lg:mt-2">
            <h3 className="mb-4 font-bold text-green-500">Order Details</h3>

            {loading ? (
              <p>Loading orders...</p>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                        Order ID
                      </th>
                      <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                        Customer
                      </th>
                      <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                        Product
                      </th>
                      <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                        Payment Status
                      </th>
                      <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                        Email Status
                      </th>
                      <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.merchantOrderId}>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {order.merchantOrderId}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {order.customer.firstName} {order.customer.lastName}
                          <br />
                          <span className="text-xs text-gray-500">
                            {order.customer.email}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {order.productTitle}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          ₹{(order.amount / 100).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-2">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-4 py-2">
                          {order.emailStatus === "SENT" ? (
                            <span className="px-2 py-1 text-sm text-white bg-blue-600 rounded-full">
                              SENT
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-sm text-white bg-gray-400 rounded-full">
                              FAILED
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-2 text-sm text-gray-700">
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
