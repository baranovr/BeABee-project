import axiosInstance from '@app/api/axiosInstance';

export interface Statistic {
  id: number;
  value: number;
  prevValue: number;
  unit: '%';
}

export const getStatistics = async (): Promise<Statistic[]> => {
  const response = await axiosInstance.get<Statistic[]>('platform/homework_types/stat/');
  return response.data;
};
