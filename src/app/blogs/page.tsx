"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Blog, fetchBlogs } from "../../queries/blog";
import Image from "next/image";
import Link from "next/link";

export default function Blogs() {
  const { data, isLoading } = useQuery<Blog[], Error>({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <p>Loading...</p>;

  // Filter blogs based on search term
  const filteredBlogs = data?.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Blogs</h1>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-80 shadow-sm"
        />
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs?.length ? (
          filteredBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.slug}`}
              className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105"
            >
              <div>
                <Image
                  src={blog.image || ''}
                  alt={blog.title}
                  height={200}
                  width={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 relative">
                  {/* Blog Title */}
                  <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>

                  {/* Blog Body */}
                  <p className="text-gray-700 text-sm line-clamp-3">{blog.body}</p>

                  {/* Blog Author */}
                  <div className="mt-4 flex items-center">
                    <Image
                      src={blog.user.avatar || ''}
                      alt={blog.user.username}
                      width={50}
                      height={50}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-gray-900 font-medium">{blog.user.username}</p>
                    </div>
                  </div>

                  {/* Blog Views */}
                  <div className="absolute bottom-4 right-4 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full shadow">
                    <p>{blog.views} views</p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
}
