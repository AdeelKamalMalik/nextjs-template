// src/queries/blogQueries.ts

import axios, { AxiosResponse } from 'axios';
import { apiGet } from '../axios';
import { User } from '@/types';

// Define the structure of a Blog
export interface Blog {
  image: string | undefined;
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  views: number;
  user: User
}

// Define the input for creating a new blog
export interface CreateBlogInput {
  title: string;
  body: string;
  image: FIle | null;
}

// Fetch all blogs
export const fetchBlogs = async (): Promise<Blog[]> => {
  // Use the common apiGet function
  const response = await apiGet<AxiosResponse<Blog[]>>('/api/blogs');
  return response.data
};

// Fetch a single blog by slug
export const fetchBlogBySlug = async (slug: string): Promise<Blog> => {
  // Use the common apiGet function
  const { data } = await apiGet<AxiosResponse<Blog>>(`/api/blogs/${slug}`);
  return data
};

// Create a new blog with custom headers for multipart/form-data
export const createBlog = async ({ title, body, image }: CreateBlogInput): Promise<Blog> => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('body', body);

  if (image.length) {
    formData.append('image', image[0]);
  }

  // Use axios directly here to set custom headers
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/blogs`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
