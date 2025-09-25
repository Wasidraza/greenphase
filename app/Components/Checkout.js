// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import Navbar from "./Navbar";
// import Footer from "./footer";

// export default function Checkout() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const title = searchParams.get("title") || "No product";
//   const color = searchParams.get("color") || "Standard"; // 👈 yahi productColor hoga
//   const power = searchParams.get("power") || "-";
//   const price = searchParams.get("price") || "0";

//   const [form, setForm] = useState({
//     email: "",
//     phone: "",
//     firstName: "",
//     lastName: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         amountRupees: Number(price),
//         productTitle: title,
//         productColor: color, // 👈 yahan fix kiya
//         form,
//       };

//       console.log("📤 Sending payload:", payload);

//       const res = await fetch("/api/phonepe/create-payment", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error((data && data.error) || "Payment init failed");
//       }
//       const redirectUrl =
//         data?.phonepeResponse?.redirectUrl ||
//         data?.phonepeResponse?.redirect_url ||
//         data?.phonepeResponse?.data?.redirect_url;

//       if (!redirectUrl) {
//         alert(
//           "Payment init succeeded but redirect URL missing. Check server logs. Order: " +
//             data.merchantOrderId
//         );
//         router.push(`/order-status?merchantOrderId=${data.merchantOrderId}`);
//         return;
//       }

//       window.location.href = redirectUrl;
//     } catch (err) {
//       console.error("pay error", err);
//       alert("Payment failed: " + (err.message || err));
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="max-w-6xl p-2 mx-auto mt-24 mb-6">
//         <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

//         {/* Product Info */}
//         <div className="p-4 mb-6 border rounded-lg bg-gray-50">
//           <h3 className="mb-3 text-xl font-bold">Your Product</h3>
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="font-medium">
//                 {title} <span className="text-gray-600">({color})</span>
//               </p>
//               <p className="text-sm text-gray-500">{power}</p>
//             </div>
//             <div className="text-right">
//               <p className="font-bold text-green-600">
//                 ₹{Number(price).toLocaleString("en-IN")}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Customer Details */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-4 space-y-4 bg-white border rounded-lg"
//         >
//           <div>
//             <h3 className="mb-2 text-lg font-semibold">Contact</h3>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Email"
//               className="w-full p-2 mb-3 border rounded"
//               required
//             />
//           </div>

//           <div>
//             <h3 className="mb-2 text-lg font-semibold">Delivery</h3>
//             <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//               <input
//                 name="firstName"
//                 value={form.firstName}
//                 onChange={handleChange}
//                 placeholder="First Name"
//                 className="p-2 border rounded"
//                 required
//               />
//               <input
//                 name="lastName"
//                 value={form.lastName}
//                 onChange={handleChange}
//                 placeholder="Last Name"
//                 className="p-2 border rounded"
//                 required
//               />
//             </div>
//             <input
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//               placeholder="Address"
//               className="w-full p-2 mt-3 border rounded"
//               required
//             />
//             <div className="grid grid-cols-1 gap-3 mt-3 md:grid-cols-3">
//               <input
//                 name="city"
//                 value={form.city}
//                 onChange={handleChange}
//                 placeholder="City"
//                 className="p-2 border rounded"
//                 required
//               />
//               <input
//                 name="state"
//                 value={form.state}
//                 onChange={handleChange}
//                 placeholder="State"
//                 className="p-2 border rounded"
//                 required
//               />
//               <input
//                 name="pincode"
//                 value={form.pincode}
//                 onChange={handleChange}
//                 placeholder="PIN Code"
//                 className="p-2 border rounded"
//                 required
//               />
//             </div>
//             <input
//               type="tel"
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               placeholder="Phone"
//               className="w-full p-2 mt-2 border rounded"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
//           >
//             Pay Now
//           </button>
//         </form>
//       </div>
//       <Footer />
//     </>
//   );
// }


"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./footer";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth(); // ✅ AuthContext se user check karenge

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
      toast.error("Please signup/login first before shopping!");
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must signup/login first!");
      return; // 🚫 Bina login ke payment allow nahi
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
        throw new Error((data && data.error) || "Payment init failed");
      }

      const redirectUrl =
        data?.phonepeResponse?.redirectUrl ||
        data?.phonepeResponse?.redirect_url ||
        data?.phonepeResponse?.data?.redirect_url;

      if (!redirectUrl) {
        alert(
          "Payment init succeeded but redirect URL missing. Check server logs. Order: " +
            data.merchantOrderId
        );
        router.push(`/order-status?merchantOrderId=${data.merchantOrderId}`);
        return;
      }

      window.location.href = redirectUrl;
    } catch (err) {
      console.error("pay error", err);
      toast.error("Payment failed: " + (err.message || err));
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
