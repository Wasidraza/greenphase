"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./footer";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

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

  useEffect(() => {
    if (!user) {
      console.warn("Please signup/login first before shopping!");
    }

    const merchantOrderId = localStorage.getItem("lastOrderId");
    if (merchantOrderId) {
      fetch(`/api/phonepe/order-status?merchantOrderId=${merchantOrderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "PENDING") {
            console.warn(
              "Your last payment was not completed. Please try again."
            );
          }
        })
        .catch((err) => {
          console.error("Error checking last order status:", err);
        });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // handleSubmit function mein ye change karein:
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must signup/login first!");
      return;
    }

    try {
      const payload = {
        amountRupees: Number(price),
        productTitle: title,
        productColor: color,
        form,
      };

      console.log("📤 Sending payload:", payload);

      const res = await fetch("/api/phonepe/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Payment init failed");
      }

      // ✅ NEW: Check if payment is successful before redirect
      if (data.merchantOrderId) {
        localStorage.setItem("lastOrderId", data.merchantOrderId);
      }

      const redirectUrl =
        data?.phonepeResponse?.redirectUrl ||
        data?.phonepeResponse?.data?.instrumentResponse.redirectInfo.url;

      if (!redirectUrl) {
        console.error("No redirect URL received");
        // router.push(`/order-status?merchantOrderId=${data.merchantOrderId}`);
        router.push("/phonepe/order-success");
        return;
      }

      window.location.href = redirectUrl;
    } catch (err) {
      console.error("Payment error:", err);
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

        {/* Customer Details */}
        <form
          onSubmit={handleSubmit}
          className="p-4 space-y-4 bg-white border rounded-lg"
        >
          <div>
            <h3 className="mb-2 text-lg font-semibold">Contact</h3>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 mb-3 border rounded"
              required
            />
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Delivery</h3>
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
              placeholder="Address"
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
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-2 mt-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Pay Now
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
