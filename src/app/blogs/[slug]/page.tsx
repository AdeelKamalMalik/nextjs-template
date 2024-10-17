"use client"
import { useQuery } from '@tanstack/react-query';

import { fetchBlogBySlug, Blog } from '../../../queries/blog';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string}>();

  const { data, isLoading } = useQuery<Blog, Error>({
    queryKey: ['blog', slug],
    queryFn: () => fetchBlogBySlug(slug as string),
    enabled: !!slug,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="relative h-96">
        {data?.image && (
          <Image
            src={data.image}
            alt={data.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        )}
        {/* Overlay for title */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-white text-4xl font-bold">{data?.title}</h1>
        </div>

        {/* Author details at bottom-right */}
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 p-4 rounded-lg flex items-center shadow-md">
          {data?.user.avatar && (
            <Image
              src={data.user.avatar}
              alt={data.user.username}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div className="ml-3">
            <p className="text-gray-800 font-semibold">{data?.user.username}</p>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="mt-8">
        {/* Rich Text Body */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: data?.body || '' }}
        />
      </div>
    </div>
  );
}