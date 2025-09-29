"use client";
import { useState } from "react";
import { User, Mail, MapPin, Phone, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function EnquiryForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          data.message ||
            "✅ Thank you! Your enquiry has been submitted successfully."
        );
        // form reset
        setForm({
          name: "",
          email: "",
          city: "",
          phone: "",
          message: "",
        });
      } else {
        toast.error(data.error || "❌ Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      toast.error("Server unreachable, please try again later.");
    }
  };

  return (
    <section className="w-full bg-[#0a0b18] py-16 px-4 md:px-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
          Enquiry Form
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          {/* Full Name */}
          <div className="flex items-center gap-2 px-3 py-3 border outline-none focus:outline-1 border-b-white">
            <User className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name*"
              value={form.name}
              onChange={handleChange}
              required
              pattern="^[a-zA-Z\s]{3,50}$"
              title="Name should be 3-50 characters, letters only"
              className="w-full text-white placeholder-gray-400 bg-transparent outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 px-3 py-3 border outline-none focus:outline-1 border-b-white">
            <Mail className="w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={form.email}
              onChange={handleChange}
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Enter a valid email address"
              className="w-full text-white placeholder-gray-400 bg-transparent outline-none"
            />
          </div>

          {/* City */}
          <div className="flex items-center gap-2 px-3 py-3 border outline-none focus:outline-1 border-b-white">
            <MapPin className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="city"
              placeholder="City*"
              value={form.city}
              onChange={handleChange}
              required
              pattern="^[a-zA-Z\s]{2,50}$"
              title="City should be 2-50 characters, letters only"
              className="w-full text-white placeholder-gray-400 bg-transparent outline-none focus:outline-1"
            />
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 px-3 py-3 border outline-none focus:outline-1 border-b-white">
            <Phone className="w-5 h-5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="91XXXXXXXXXX*"
              value={form.phone}
              onChange={handleChange}
              required
              pattern="^[0-9]{10}$"
              title="Enter a valid 10-digit phone number"
              className="w-full text-white placeholder-gray-400 bg-transparent outline-none focus:outline-1"
            />
          </div>

          {/* Message */}
          <div className="flex items-start gap-2 px-3 py-3 border outline-none focus:outline-1 border-b-white md:col-span-2">
            <MessageSquare className="w-5 h-5 mt-1 text-gray-400" />
            <textarea
              name="message"
              placeholder="Additional Message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              className="w-full text-white placeholder-gray-400 bg-transparent outline-none resize-none focus:outline-1"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              className="px-6 py-3 font-medium text-white transition bg-green-600 shadow-md rounded-xl hover:opacity-90"
            >
              Enquiry Now
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
