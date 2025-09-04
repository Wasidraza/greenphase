"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
export const dynamic = "force-dynamic";

export default function Signup() {
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect =
    searchParams.get("redirect") || "/product/smart-home-charger";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // ✅ Create userData object
    const userData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
    };

    // ✅ Save in localStorage and context
    localStorage.setItem("user", JSON.stringify(userData));
    login(userData);

    toast.success("✅ Signup successful!");

    // ✅ Redirect to intended page (checkout/product)
    router.push(redirect);

    setForm({ name: "", email: "", phone: "", password: "" });
  } catch (error) {
    toast.error("❌ " + error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
        <h2 className="mb-4 text-2xl font-bold text-green-600">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}