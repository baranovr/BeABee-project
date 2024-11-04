// calendar.api.ts

import axiosInstance from '@app/api/axiosInstance';

export interface CalendarExam {
  exam: number;
  date_time: string;
}

export const getExamCalendar = async (id: number): Promise<CalendarExam[]> => {
  try {
    const response = await axiosInstance.get<CalendarExam[]>(`platform/calendar/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
};
