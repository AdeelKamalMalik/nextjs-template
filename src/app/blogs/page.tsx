"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogs } from "../../queries/blog";
import BlogCard from "../../components/BlogCard";
import { Blog } from "@/types";

export default function Blogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useQuery<Blog[], Error>({
    queryKey: ['fetch-all-blogs', searchTerm, page],
    queryFn: () => fetchBlogs(searchTerm, page, limit),
  });

  useEffect(() => {
    if (!isLoading && data) {
      if (page === 1) {
        setBlogs(data);
      } else {
        setBlogs((prevBlogs) => [...prevBlogs, ...data]);
      }
    }
  }, [data, isLoading, page]);

  useEffect(() => {
    setPage(1); 
  }, [searchTerm]);

  useEffect(() => {
    refetch(); 
  }, [page, searchTerm, refetch]);

  if (isLoading && page === 1) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Blogs</h1>
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setBlogs([]);
          }}
          className="border border-gray-300 rounded-lg p-2 w-80 shadow-sm"
        />
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 gap-8">
        {blogs?.length ? (
          blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} /> // Use the BlogCard component
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>

      {blogs.length > 0 && data?.length === limit && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
