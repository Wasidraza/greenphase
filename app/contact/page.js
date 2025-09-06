"use client";
import { useState } from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success( "Thanks for reaching out! We'll get back to you soon");
        setForm({ name: "", phone: "", email: "", message: "" });
      } else {
        toast.error(data.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Server error, please try again later");
    }
  };

  return (
    <section className="min-h-screen w-full text-[#06091f] flex items-center justify-center px-4 sm:px-6 py-12 mt-16">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">
        
        {/* Left side - Form */}
        <div className="order-1">
          <h2 className="mb-6 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            <span className="text-transparent bg-gradient-to-r from-green-500 to-green-600 bg-clip-text">
              Contact
            </span>{" "}
            Us
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Name*"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone*"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
              required
            />

            <textarea
              name="message"
              placeholder="Additional Message"
              rows="6"
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
            ></textarea>

            <button
              type="submit"
              className="w-full px-8 py-3 font-semibold text-white transition rounded-lg shadow-lg sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90"
            >
              SUBMIT
            </button>
          </form>
        </div>

        {/* Right side - Map + Address */}
        <div className="order-2">
          <div className="p-6 space-y-6 bg-black shadow-lg sm:p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white">Connect with us</h2>
            <p className="text-sm text-gray-300 sm:text-base">
              Whether you are interested in working together on a new EV
              charging project, have a question/comment, interested in career
              opportunities at Green Phase, or just want to drop us a line, we’d
              love to hear from you.
            </p>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">Address</h3>
              <p className="flex items-start gap-2 text-sm text-gray-200 sm:text-base">
                <MapPin className="w-5 h-5 mt-1 text-green-400 shrink-0" /> 
               kalindi Kunj, Okhla ,New Delhi -110025
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">Phone</h3>
              <p className="flex items-center gap-2 text-sm text-gray-200 sm:text-base">
                <Phone className="w-5 h-5 text-green-400" /> +91 7827488393
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">Email</h3>
              <p className="flex items-center gap-2 text-sm text-gray-200 sm:text-base">
                <Mail className="w-5 h-5 text-green-400" /> sale@greenphase.in
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
