"use client";
import { useEffect, useState } from "react";
import { User, Mail, Phone, LogOut } from "lucide-react";

export default function AdminProfileCard() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (err) {
        console.error("Error parsing admin data:", err);
      }
    }
  }, []);

  if (!admin) {
    return (
      <div className="p-8 text-center bg-white border border-gray-100 shadow-lg rounded-2xl">
        <p className="text-lg text-gray-500">No admin logged in</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto overflow-hidden shadow-2xl bg-gradient-to-br from-green-500 to-green-600 rounded-2xl">
      {/* Top Banner */}
      <div className="relative w-full bg-white/10 h-28">
        <div className="absolute transform -translate-x-1/2 left-1/2 -bottom-12">
          <div className="flex items-center justify-center bg-white border-4 border-white rounded-full shadow-xl w-28 h-28">
            <User className="w-12 h-12 text-green-600" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-6 pt-16 pb-6 text-center text-white">
        <h3 className="text-2xl font-bold">{admin.name}</h3>
        <p className="mt-1 text-sm text-indigo-100">Administrator</p>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-5 h-5 text-indigo-200" />
            <span>{admin.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-5 h-5 text-indigo-200" />
            <span>{admin.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
