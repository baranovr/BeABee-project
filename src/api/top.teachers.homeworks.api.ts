import axiosInstance from '@app/api/axiosInstance';

export interface HomeworkByDay {
  teacher_id: number;
  day: number;
  count: number;
  type: string;
}

export const getTeacherHomeworkByDay = async (): Promise<HomeworkByDay[]> => {
  const response = await axiosInstance.get<HomeworkByDay[]>('platform/top-teachers-homework-by-day/');
  return response.data;
};
