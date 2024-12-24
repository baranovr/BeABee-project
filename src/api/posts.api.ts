// posts.api.ts

import axiosInstance from '@app/api/axiosInstance';

export interface Post {
  id: number;
  photo: string;
  title: string;
  avatar: string;
  author: string;
  status_in_service: string
  description: string;
  created_at: number;
}

export const getPosts = async (): Promise<Post[]> => {
  const response = await axiosInstance.get<Post[]>('platform/posts/');
  return response.data;
};
