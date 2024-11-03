import { AxiosResponse } from 'axios';
import { Notification } from '@/types';
import { apiGet, apiPost } from '@/axios';

export const getAllNotifications = async (): Promise<Notification[]> => {
  const { data } = await apiGet<AxiosResponse<Notification[]>>(`/api/notifications`);
  return data;
};

export const checkUnRead = async (): Promise<{ unread: boolean }> => {
  const { data } = await apiGet<AxiosResponse<{ unread: boolean }>>(`/api/notifications/check-unread`);
  return data;
};

export const markAllRead = async (): Promise<void> => {
  return await apiPost(`/api/notifications/mark-all-read`, {});
};
