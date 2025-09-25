"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function AdminNav() {
  const router = useRouter();
  return (
    <nav className="flex items-center justify-between px-6 py-4 text-white bg-green-600 shadow-md">
      {/* Logo */}
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => router.push("/admin/dashboard")}
      >

      </div>

      {/* Profile Icon */}
      <div className="cursor-pointer">
       <User size={30} className="text-white"/>
      </div>
    </nav>
  );
}
