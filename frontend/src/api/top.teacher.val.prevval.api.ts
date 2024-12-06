import axiosInstance from '@app/api/axiosInstance';

export interface TeacherValues {
  id: number;
  value: number;
  prevValue: number;
}

export const getTeacherValuesList = async (): Promise<TeacherValues[]> => {
  const response = await axiosInstance.get<TeacherValues[]>('platform/top-teachers-values/');
  return response.data;
};
