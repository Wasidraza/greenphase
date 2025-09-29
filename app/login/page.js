"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "../Components/Navbar";
import Footer from "../Components/footer";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill all fields!");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      login(data.user); 
      toast.success("Login successful!");
      router.push("/"); 
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center w-full min-h-screen p-4 bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full max-w-md gap-4 p-8 bg-white shadow-lg rounded-xl"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900">Sign in</h2>
          <p className="text-sm text-center text-gray-500">
            Welcome back! Please sign in to continue
          </p>

          {/* Email */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email*"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="Enter a valid email address"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password*"
              pattern=".{6,20}"
              title="Password must be 6-20 characters"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-500 right-3 top-3"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> Remember me
            </label>
            <a href="#" className="underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center text-gray-500">
            Don’t have an account?{" "}
            <a href="/signup" className="text-green-600 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
}
