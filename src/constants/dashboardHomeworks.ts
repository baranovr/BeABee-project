// dashboardHomeworks.ts

import { getHomeworks } from '../api/homeworks.api';

export interface Homework {
  id: number;
  title: string;
  description: string;
  created_at: string;
  teacher_avatar: string;
  teacher: string;
  teacher_first_name: string;
  teacher_last_name: string;
  teacher_surname: string;
  subject: string;
  type: string;
  deadline: string;
  added_by: string;
  for_group: string;
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
        teacher_first_name: homework.teacher_first_name,
        teacher_last_name: homework.teacher_last_name,
        teacher_surname: homework.teacher_surname,
        subject: homework.subject,
        type: homework.type,
        deadline: homework.deadline,
        added_by: homework.added_by,
        for_group: homework.for_group,
      }),
    );
  } catch (error) {
    console.error('Error fetching recently news:', error);
    throw error;
  }
};
