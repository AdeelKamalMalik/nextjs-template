// src/queries/authQueries.ts

import axios, { AxiosResponse } from 'axios';
import { apiGet, apiPost } from '../axios';
import { User } from '@/types';


// Define the input for signing up a user
export interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: FileList | null;
}

// Define the input for logging in a user
export interface LoginInput {
  email: string;
  password: string;
}

// Define the structure of the login response
export interface LoginResponse {
  jwt: string;
}

export const signup = async ({ email, password, firstName, lastName, avatar }: SignupInput): Promise<User> => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);

  if (avatar) {
    formData.append('avatar', avatar[0]);
  }

  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/signup`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

// Function to log in a user
export const login = async ({ email, password }: LoginInput): Promise<LoginResponse> => {
  // Use the common apiPost function
  const { data } = await apiPost<AxiosResponse<LoginResponse>>('/api/auth/login', { email, password });
  return data
};

// Function to fetch the current user
export const fetchCurrentUser = async (): Promise<User> => {
  const { data } = await apiGet<AxiosResponse<User>>('/api/auth/me');
  return data
};
