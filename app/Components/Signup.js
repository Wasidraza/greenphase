// "use client";

// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../context/AuthContext";
// import Navbar from "./Navbar";
// import Footer from "./footer";

// export default function Signup({ redirect = "/product/smart-home-charger" }) {
//   const { login } = useAuth();
//   const router = useRouter();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch("/api/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);

//       const userData = {
//         name: form.name,
//         email: form.email,
//         phone: form.phone,
//       };
//       localStorage.setItem("user", JSON.stringify(userData));
//       login(userData);

//       toast.success("Signup successful!");
//       router.push(redirect);
//     } catch (err) {
//       toast.error("Invalid User" + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
//           <h2 className="mb-4 text-2xl font-bold text-green-600">Signup</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Full Name"
//               className="w-full p-2 border rounded-lg"
//               required
//             />
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Email Address"
//               className="w-full p-2 border rounded-lg"
//               required
//             />
//             <input
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               placeholder="Phone Number"
//               className="w-full p-2 border rounded-lg"
//               required
//             />
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Password"
//               className="w-full p-2 border rounded-lg"
//               required
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full p-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
//             >
//               {loading ? "Signing up..." : "Sign Up"}
//             </button>
//           </form>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }

// app/Components/Signup.js
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./footer";
import { useAuth } from "../context/AuthContext";

export default function Signup({
  defaultRedirect = "/product/smart-home-charger",
}) {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") ?? defaultRedirect;

  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

      const userData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      login(userData);

      toast.success("Signup successful!");
      router.push(redirect);
    } catch (err) {
      toast.error("Invalid User: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
          <h2 className="mb-4 text-2xl font-bold text-green-600">Signup</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-2 border rounded-lg"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-2 border rounded-lg"
              required
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-2 border rounded-lg"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
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
        </div>
      </div>
      <Footer />
    </>
  );
}
