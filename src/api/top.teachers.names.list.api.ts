// top.teachers.names.list.api.ts

import axiosInstance from '@app/api/axiosInstance';

export interface TopTeacher {
  id: number;
  name: string;
  teacher_avatar: string;
}

export const getTopTeachersList = async (): Promise<TopTeacher[]> => {
  const response = await axiosInstance.get<TopTeacher[]>('platform/top-teachers-names/');
  return response.data;
};
