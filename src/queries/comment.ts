// src/queries/blogQueries.ts

import axios, { AxiosResponse } from 'axios';
import { apiGet } from '../axios';
import { Comment, PostCommentPayload, PostReplyPayload } from '@/types';
import { getFileRequestHeader, getHeaders } from '@/utils';

export const fetchComments = async (slug: string): Promise<Comment[]> => {
  const response = await apiGet<AxiosResponse<Comment[]>>(`/api/${slug}/comments`);
  return response.data;
};

export const postComment = async ({ slug, body, image }: PostCommentPayload): Promise<Comment> => {
  const formData = new FormData();
  formData.append('body', body);
  console.log(image, body, slug)
  if (image) {
    formData.append('image', image);
  }

  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/${slug}/comments`, formData, {
    headers: getFileRequestHeader(),
  });

  return data;
};

export const postReply = async ({ commentId, body, image }: PostReplyPayload): Promise<Comment> => {
  const formData = new FormData();
  formData.append('body', body);

  if (image) {
    formData.append('image', image);
  }

  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comments/${commentId}`, formData, {
    headers: getFileRequestHeader(),
  });

  return data;
};

export const deleteReply = async (id: string): Promise<Comment> => {
  const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comments/${id}`, {
    headers: getHeaders()
  });

  return data;
};
