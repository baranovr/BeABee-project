// importantinfo.api.ts

import axiosInstance from '@app/api/axiosInstance';

export interface ImportantInfo {
  id: number;
  title: string;
  status_in_service: string;
  owner: string;
  image: string;
  description: string;
  created_at: number;
  avatar: string;
}

export const getImportantInfoList = async (): Promise<ImportantInfo[]> => {
  const response = await axiosInstance.get<ImportantInfo[]>('platform/importantinfo/');
  return response.data;
};
