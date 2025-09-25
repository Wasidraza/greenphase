"use client";

import React from "react";
import { notFound } from "next/navigation";
import blogs from "@/app/data/blog";
import Image from "next/image";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/footer";

export default function BlogDetail({ params }) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const blog = blogs.find((b) => b.id === id);

  if (!blog) return notFound();

  return (
  <>
  <Navbar/>
    <div className="container px-4 mx-auto pt-28">
      <Image
        src={blog.image}
        alt={blog.title}
        width={800}
        height={700}
        className="object-cover lg:object-center w-full lg:h-[600px] h-[400px] object-top rounded-xl" 
      />

      <h3 className="mt-6 lg:text-4xl text-2xl font-bold text-[#31B345]">{blog.title}</h3>


      {/* ✅ HTML safe render */}
      <div
        className="pb-8 mt-6 space-y-4 leading-relaxed text-gray-900"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  <Footer/>
  </>
  );
}

