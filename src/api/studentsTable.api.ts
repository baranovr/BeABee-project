import axiosInstance from '@app/api/axiosInstance';

export interface StudentInTable {
  id: number;
  first_name: string;
  last_name: string;
  surname: string;
  last_first_sur: string;
  group: string;
  subgroup: string;
  full_group: string;
  email: string;
  role: string;
  location: string;
  role_and_location: string;
}

export const getStudentsInTable = async (): Promise<StudentInTable[]> => {
  const response = await axiosInstance.get<StudentInTable[]>('platform/students_table/');
  return response.data;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await axiosInstance.delete(`platform/students_table/${id}/`);
};

export const inviteStudent = (studentId: number): Promise<any> => {
  return axiosInstance.post(`platform/students/${studentId}/invite/`);
};
