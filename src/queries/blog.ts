// src/queries/blogQueries.ts

import axios, { AxiosResponse } from 'axios';
import { apiGet } from '../axios';
import { Blog, CreateBlogInput, UpdateBlogInput } from '@/types';
import { getFileRequestHeader } from '@/utils';

export const fetchBlogs = async (searchTerm: string, page: number, limit: number): Promise<Blog[]> => {
  const response = await apiGet<AxiosResponse<Blog[]>>(`/api/blogs?page=${page || 1}&limit=${limit || 10}&search=${searchTerm || ''}`);
  return response.data;
};

export const fetchBlogBySlug = async (slug: string): Promise<Blog> => {
  const { data } = await apiGet<AxiosResponse<Blog>>(`/api/blogs/${slug}`);
  return data
};

export const createBlog = async ({ title, body, image }: CreateBlogInput): Promise<Blog> => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('body', body);

  if (image?.length) {
    formData.append('image', image[0]);
  }

  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/blogs`, formData, {
    headers: getFileRequestHeader(),
  });
  return data;
};

export const updateBlog = async ({ title, body, image, slug }: UpdateBlogInput): Promise<Blog> => {
  const formData = new FormData();
  if (title) formData.append('title', title);
  if (body) formData.append('body', body);

  if (image?.length) {
    formData.append('image', image[0]);
  }

  const { data } = await axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/blogs/${slug}`, formData, {
    headers: getFileRequestHeader(),
  });
  return data;
};
