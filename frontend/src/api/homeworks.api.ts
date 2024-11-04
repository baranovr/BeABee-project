// homeworks.api.ts

import axiosInstance from '@app/api/axiosInstance';

export interface Homework {
  id: number;
  title: string;
  description: string;
  file: string;
  subject: string;
  type: string;
  teacher_avatar: string;
  teacher: string;
  created_at: string;
  deadline: number;
  added_by: string;
}

export const getHomeworks = async () => {
  const response = await axiosInstance.get<Homework[]>('platform/homeworks/');
  return response.data;
};
