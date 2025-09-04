"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Checkout() {
  const params = useSearchParams();
  const router = useRouter();

  const title = params.get("title") || "No product";
  const productColor = params.get("color") || "Standard";
  const price = params.get("price") || "0";
  const power = params.get("power") || "-";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/payment");
  };

  return (
    <div className="max-w-6xl p-2 mx-auto mt-24 mb-6">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      {/* Product */}
      <div className="p-4 mb-6 border rounded-lg bg-gray-50">
        <h3 className="mb-3 text-xl font-bold">Your Product</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              {title} <span className="text-gray-600">({productColor})</span>
            </p>
            <p className="text-sm text-gray-500">{power}</p>
          </div>
          <p className="font-bold text-green-600">
            ₹{Number(price).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Customer Details */}
      <form
        onSubmit={handleSubmit}
        className="p-4 space-y-4 bg-white border rounded-lg"
      >
        {/* Contact */}
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

        {/* Delivery */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Delivery</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="p-2 border rounded"
              required
            />
          </div>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-2 mt-3 border rounded"
            required
          />
          <div className="grid grid-cols-1 gap-3 mt-3 md:grid-cols-3">
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="PIN Code"
              className="p-2 border rounded"
              required
            />
          </div>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
            className="w-full p-2 mt-3 border rounded"
          />
        </div>

        {/* Payment Button */}
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
