// app/checkout/page.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./footer";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const title = searchParams.get("title") || "No product";
  const color = searchParams.get("color") || "Standard";
  const power = searchParams.get("power") || "-";
  const price = searchParams.get("price") || "0";

  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      alert("Please signup/login first before shopping!");
      router.push("/login");
      return;
    }

    // Previous pending order check
    const lastOrderId = localStorage.getItem("lastOrderId");
    if (lastOrderId) {
      checkOrderStatus(lastOrderId);
    }
  }, [user, router]);

  const checkOrderStatus = async (orderId) => {
    try {
      const res = await fetch(
        `/api/phonepe/order-status?merchantOrderId=${orderId}`
      );
      const data = await res.json();

      if (data.status === "PENDING") {
        console.warn("Your last payment was not completed. Please try again.");
        localStorage.removeItem("lastOrderId");
      }
    } catch (err) {
      console.error("Error checking last order:", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Checkout page - improved
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      alert("You must signup/login first!");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        amountRupees: Number(price),
        productTitle: title,
        productColor: color,
        form,
      };

      console.log("📤 Creating payment request...");

      const res = await fetch("/api/phonepe/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment initiation failed");
      }

      console.log("✅ Payment initiated:", data.merchantOrderId);

      // Save order ID for status checking
      if (data.merchantOrderId) {
        localStorage.setItem("lastOrderId", data.merchantOrderId);

        // Immediately check if order exists in DB
        setTimeout(async () => {
          const statusRes = await fetch(
            `/api/phonepe/order-status?merchantOrderId=${data.merchantOrderId}`
          );
          const statusData = await statusRes.json();
          console.log("🎯 Order status check:", statusData);
        }, 1000);
      }

      // PhonePe redirect URL
      const redirectUrl =
        data?.phonepeResponse?.data?.redirectUrl ||
        data?.phonepeResponse?.redirectUrl ||
        data?.phonepeResponse?.redirect_url;

      if (redirectUrl) {
        console.log("🔗 Redirecting to PhonePe...");
        window.location.href = redirectUrl;
      } else {
        console.error("❌ No redirect URL received:", data);
        throw new Error("Payment gateway error - no redirect URL received");
      }
    } catch (err) {
      console.error("💥 Payment error:", err);
      alert(`Payment Error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl p-2 mx-auto mt-24 mb-6">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

        {/* Product Info */}
        <div className="p-4 mb-6 border rounded-lg bg-gray-50">
          <h3 className="mb-3 text-xl font-bold">Your Product</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {title} <span className="text-gray-600">({color})</span>
              </p>
              <p className="text-sm text-gray-500">{power}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">
                ₹{Number(price).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Details Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 space-y-4 bg-white border rounded-lg"
        >
          {/* Contact Details */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Contact Information</h3>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-2 mb-3 border rounded"
              required
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Shipping Address</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="p-2 border rounded"
                required
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="p-2 border rounded"
                required
              />
            </div>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Full Address"
              className="w-full p-2 mt-3 border rounded"
              required
            />
            <div className="grid grid-cols-1 gap-3 mt-3 md:grid-cols-3">
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="p-2 border rounded"
                required
              />
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="p-2 border rounded"
                required
              />
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="PIN Code"
                className="p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Pay Now Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 text-white rounded font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading
              ? "Processing..."
              : `Pay ₹${Number(price).toLocaleString("en-IN")}`}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
