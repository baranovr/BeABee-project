import axiosInstance from '@app/api/axiosInstance';

export interface Subject {
  id: number;
  name: string;
}

export interface Teacher {
  id: number;
  teacher_avatar: string;
  first_name: string;
  last_name: string;
  surname: string;
  full_name_sur: string;
  subjects: Subject[];
  degree: string;
  email: string;
}

export const getTeachersData = async (): Promise<Teacher[]> => {
  const response = await axiosInstance.get<Teacher[]>('platform/teachers/');
  return response.data;
};
