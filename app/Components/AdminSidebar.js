"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Enquiries", path: "/admin/enquiries" },
    { name: "Contacts", path: "/admin/contact" },
    { name: "Payments", path: "/admin/payment" },
  ];

  const handleLogout = () => {
    alert("Logged out successfully!");
    router.push("/admin/login");
  };

  return (
    <div className="fixed top-0 left-0 flex flex-col justify-between w-64 h-full text-white bg-green-600">
      {/* Logo / Brand */}
      <div
        className="p-6 text-xl font-bold cursor-pointer"
        onClick={() => router.push("/admin/dashboard")}
      >
        Green phase
      </div>

      {/* Navigation Links */}
      <div className="flex-1 mt-6">
        {links.map((link) => (
          <button
            key={link.name}
            className="w-full px-6 py-6 text-left transition-colors hover:bg-green-700"
            onClick={() => router.push(link.path)}
          >
            {link.name}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-green-700">
        <button
          className="w-full px-6 py-3 text-left transition bg-red-500 rounded hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
