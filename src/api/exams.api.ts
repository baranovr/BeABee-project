// exams.api.ts

import axiosInstance from '@app/api/axiosInstance';

export interface Teacher {
  id: number;
  teacher_avatar: string;
  full_name_sur: string;
  subjects: { id: number; name: string }[];
  degree: string;
  email: string;
}

export interface Exam {
  id: number;
  teacher: Teacher;
  subject: string;
  date_time: number;
  group: string;
  type: string;
  details: string;
}

export const getExams = async (): Promise<Exam[]> => {
  const response = await axiosInstance.get<Exam[]>('platform/exams/');
  return response.data;
};
