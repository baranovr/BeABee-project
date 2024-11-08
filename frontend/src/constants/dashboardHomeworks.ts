// dashboardHomeworks.ts

import { getHomeworks } from '../api/homeworks.api';

export interface Homework {
  id: number;
  title: string;
  description: string;
  created_at: string;
  teacher_avatar: string;
  teacher: string;
  subject: string;
  type: string;
  deadline: number;
  added_by: string;
}

export const getHomeworksList = async (): Promise<Homework[]> => {
  try {
    const homeworks = await getHomeworks();

    return homeworks.map(
      (homework): Homework => ({
        id: homework.id,
        title: homework.title,
        description: homework.description,
        created_at: homework.created_at,
        teacher_avatar: homework.teacher_avatar,
        teacher: homework.teacher,
        subject: homework.subject,
        type: homework.type,
        deadline: homework.deadline,
        added_by: homework.added_by,
      }),
    );
  } catch (error) {
    console.error('Error fetching recently news:', error);
    throw error;
  }
};
