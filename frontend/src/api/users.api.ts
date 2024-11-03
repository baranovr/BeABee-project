import { UserInList } from '@app/api/user.types';
import axiosInstance from '@app/api/axiosInstance';

// или с использованием async/await
export const getUsersList = async (): Promise<UserInList[]> => {
  const response = await axiosInstance.get<UserInList[]>('user/users/');
  return response.data;
};
