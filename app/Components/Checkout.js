"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // you can send form + product data to payment or backend
    router.push("/payment");
  };

  return (
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
      <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white border rounded-lg">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Contact</h3>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email or Mobile Number"
            className="w-full p-2 border rounded"
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
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
            className="w-full p-2 mt-3 border rounded"
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
  );
}
