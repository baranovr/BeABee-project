// recentlynews.api.ts

import axiosInstance from '@app/api/axiosInstance';

export interface News {
  id: number;
  file: string;
  title: string;
  description: string;
  created_at: number;
  posted_by: string;
  avatar: string;
}

export const getNewsList = async (): Promise<News[]> => {
  const response = await axiosInstance.get<News[]>('platform/news/');
  return response.data;
};
