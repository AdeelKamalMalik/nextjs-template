/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getHeaders } from '../utils';

const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

// axios.defaults.withCredentials = true
// axios.defaults.baseURL = baseURL

const instance = (): AxiosInstance => axios.create({
  baseURL,
  headers: getHeaders()
});


type ApiResponse<T> = AxiosResponse<T>;
type RequestParams = Record<string, any>;

export const apiGet = async <T>(url: string, params: RequestParams = {}): Promise<T> => {
  try {
    const response: ApiResponse<T> = await instance().get(url, { params });
    return response as T;
  } catch (error) {
    throw error;
  }
};

export const apiPost = async <T>(url: string, data: any = {}): Promise<T> => {
  try {
    const response: ApiResponse<T> = await instance().post(url, data);
    return response as T;
  } catch (error) {
    throw error;
  }
};

export const apiPut = async <T>(url: string, data: any = {}): Promise<T> => {
  try {
    const response: ApiResponse<T> = await instance().put(url, data);
    return response as T;
  } catch (error) {
    throw error;
  }
};

export const apiPatch = async <T>(url: string, data: any = {}): Promise<T> => {
  try {
    const response: ApiResponse<T> = await instance().patch(url, data);
    return response as T;
  } catch (error) {
    throw error;
  }
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  try {
    const response: ApiResponse<T> = await instance().delete(url);
    return response as T;
  } catch (error) {
    throw error;
  }
};
