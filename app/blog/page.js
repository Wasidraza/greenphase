"use client";
import blogs from "../data/blog";
import Link from "next/link";
import Image from "next/image";

export default function BlogPage() {
  return (
    <div className="px-4 pt-24 pb-16 mx-auto max-w-7xl">
      <h1 className="mb-10 text-4xl font-bold text-center">Latest Blogs</h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="flex flex-col overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-sm group rounded-2xl hover:shadow-xl"
          >
            {/* Blog Image */}
            <div className="relative w-full overflow-hidden h-52">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Blog Content */}
            <div className="flex flex-col flex-1 p-5">
              <h3 className="text-lg font-semibold text-green-600 transition md:text-xl line-clamp-2 group-hover:text-black">
                {blog.title}
              </h3>
              <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                {blog.excerpt}
              </p>

              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <span>{blog.date}</span>
                <Link
                  href={`/blog/${blog.id}`}
                  className="font-medium text-black hover:text-green-700"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
