"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "../Components/Navbar";
import Footer from "../Components/footer";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("✅ Login successful!");
      console.log("User Data:", data.user);

      // ✅ Redirect to home page
      router.push("/");
    } catch (error) {
      toast.error("Invalid credentials");
      setMessage("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
          <h1 className="mb-4 text-2xl font-bold text-green-600">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {message && (
            <p className="mt-3 text-sm font-medium text-center text-red-500">
              {message}
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
