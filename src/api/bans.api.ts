import axiosInstance from '@app/api/axiosInstance';

export interface Bans {
  id: number;
  user: number;
  reason: string;
  created_at: number;
}

export const getBansList = async (): Promise<Bans[]> => {
  const response = await axiosInstance.get<Bans[]>('platform/bans/');
  return response.data;
};
