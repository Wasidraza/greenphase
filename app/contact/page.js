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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
      toast.success(data.message || "Thanks for reaching out! We'll get back to you soon");
        setForm({ name: "", phone: "", email: "", message: "" }); // reset form
      } else {
        toast.error(data.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Server error, please try again later");
    }
  };
  
  return (
    <section className="min-h-screen w-full text-[#06091f] flex items-center justify-center p-6 mt-20">
      <div className="grid w-full grid-cols-1 max-w-[90%] mx-auto gap-10 md:grid-cols-2">
        {/* Left side - Form */}
        <div className="order-2 lg:order-1">
          <h2 className="mb-5 text-5xl font-extrabold">
            <span className="text-transparent bg-gradient-to-r from-green-500 to-green-600 bg-clip-text">
              Contact
            </span>{" "}
            Us
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Name*"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded-lg focus:border-green-500 focus:outline-none"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="91*"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded-lg focus:border-green-500 focus:outline-none"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded-lg focus:border-green-500 focus:outline-none"
              required
            />

            <textarea
              name="message"
              placeholder="Additional Message"
              rows="12"
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent border border-gray-500 rounded-lg focus:border-green-500 focus:outline-none"
            ></textarea>

            <button
              type="submit"
              className="px-8 py-3 font-semibold text-white transition rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90"
            >
              SUBMIT
            </button>
          </form>
        </div>

        {/* Right side - Map + Address */}
        <div className="pt-8 space-y-6 lg:order-1 lg:mt-10">
          <div className="p-6 bg-black rounded-lg shadow-lg">
            <h2 className="mb-2 text-xl font-bold text-white">
              Connect with us
            </h2>
            <p className="text-gray-300">
              Whether you are interested in working together on a new EV
              charging project, have a question/comment, interested in career
              opportunities at ChargeZone, or just want to drop us a line, we’d
              love to hear from you.
            </p>
            <h3 className="pt-3 mb-2 text-xl font-bold text-white">Address</h3>
            <p className="flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5 text-green-400" /> Okhla Vihar , Jamia
              Nagar, New Delhi 110025 , India
            </p>

            <div className="mt-4 space-y-2">
              <h3 className="mb-2 text-xl font-bold text-white">
                Phone Number
              </h3>
              <p className="flex items-center gap-2 text-white">
                <Phone className="w-5 h-5 text-green-400" /> +91 78274 88393
              </p>
              <h3 className="mb-2 text-xl font-bold text-white">Email</h3>
              <p className="flex items-center gap-2 text-white">
                <Mail className="w-5 h-5 text-green-400" /> info@mycompany.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
