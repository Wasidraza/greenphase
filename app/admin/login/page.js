"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Login successful
      toast.success("Login successful! Welcome " + data.admin.name);
      setLoading(false);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      // Redirect to admin dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-4 mx-auto">
        <form
          className="w-full max-w-xl p-4 px-8 mx-auto mt-24 mb-10 text-center bg-white border border-gray-300/60 rounded-2xl"
          onSubmit={handleSubmit}
        >
          <h3 className="mt-10 text-3xl font-medium text-gray-900">
            Admin Login
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Please sign in to continue
          </p>

          {/* Email */}
          <div className="flex items-center w-full h-12 gap-2 pl-6 mt-10 overflow-hidden bg-white border rounded-full border-gray-300/80">
            <svg
              width="16"
              height="11"
              viewBox="0 0 16 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="email"
              placeholder="Email id"
              className="w-full h-full text-sm text-gray-500 placeholder-gray-500 bg-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center w-full h-12 gap-2 pl-6 mt-4 overflow-hidden bg-white border rounded-full border-gray-300/80">
            <svg
              width="13"
              height="17"
              viewBox="0 0 13 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="password"
              placeholder="Password"
              className="w-full h-full text-sm text-gray-500 placeholder-gray-500 bg-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="mt-2 text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full mt-5 text-white transition-opacity bg-indigo-500 rounded-full h-11 hover:opacity-90"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-3 text-sm text-gray-500 mb-11">
            <Link className="text-indigo-500" href="#">
              Forgot Password
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default AdminLogin;
