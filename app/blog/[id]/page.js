"use client";

import { notFound } from "next/navigation";
import blogs from "@/app/data/blog";
import Image from "next/image";

export default function BlogDetail({ params }) {
  const blog = blogs.find((b) => b.id === params.id);

  if (!blog) return notFound();

  return (
    <div className="max-w-3xl px-4 py-10 mx-auto">
      <Image
        src={blog.image}
        alt={blog.title}
        width={800}
        height={400}
        className="object-cover w-full h-64 rounded-xl"
      />
      <h1 className="mt-6 text-3xl font-bold">{blog.title}</h1>
      <p className="mt-2 text-sm text-gray-500">{blog.date}</p>
      <div className="mt-6 space-y-4 leading-relaxed text-gray-700">
        {blog.content}
      </div>
    </div>
  );
}
