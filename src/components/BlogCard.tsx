import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';

import { BlogCardProps } from '@/types';

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link
      key={blog.id}
      href={`/blogs/${blog.slug}`}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 w-full"
    >
      <div className="flex items-start space-x-6 p-6" style={{ minHeight: '300px' }}>
        <div>
          <Image
            src={blog.image || ""}
            alt={blog.title}
            height={250}
            width={250}
            className="object-cover rounded-lg"
            style={{ minWidth: '250px', minHeight: '250px', maxHeight: '250px' }} // Ensuring consistent image size
          />
        </div>

        <div className="flex-1 flex flex-col justify-between h-[250px]">
          <div className="flex-grow">
            <h2 className="text-3xl font-semibold mb-4">{blog.title}</h2>
            <div
              className="text-gray-700 text-base line-clamp-4 mb-4"
              dangerouslySetInnerHTML={{ __html: blog?.body || '' }}
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <Image
                src={blog.user.avatar || ""}
                alt={blog.user.username}
                width={50}
                height={50}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="text-gray-900 font-medium">{blog.user.username}</p>
                <p className="text-gray-500 text-sm">
                  Posted on {moment(blog.created_at).format('MMMM DD, YYYY')} {/* Using Moment.js for formatting */}
                </p>
              </div>
            </div>

            <div className="text-gray-700 text-sm bg-gray-100 px-3 py-1 rounded-full shadow">
              <p>{blog.views} views and {blog.comments} comments</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
