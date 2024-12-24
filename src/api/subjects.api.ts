import axiosInstance from '@app/api/axiosInstance';

export interface Subject {
  id: number;
  name: string;
  group: string;
  created_at: string;
}

export const getSubjectsData = async (): Promise<Subject[]> => {
  const response = await axiosInstance.get<Subject[]>('platform/subjects/');
  return response.data;
};
