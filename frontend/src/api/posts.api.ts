// posts.api.ts

import axiosInstance from '@app/api/axiosInstance';

interface Tag {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  photo: string;
  title: string;
  avatar: string;
  user: string;
  description: string;
  created_at: number;
  tags: Tag[];
}

export const getPosts = async (): Promise<Post[]> => {
  const response = await axiosInstance.get<Post[]>('platform/posts/');
  return response.data;
};
