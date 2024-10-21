import { Dates } from 'constants/Dates';

export interface CalendarEvent {
  date: number;
  teacher: number;
}

const now = Dates.getToday().valueOf();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getUserCalendar = (id: number): Promise<CalendarEvent[]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res([
        {
          teacher: 5,
          date: now - 1000 * 60 * 60 * 24 * 5,
        },
        {
          teacher: 1,
          date: now + 1000 * 60 * 60 * 24 * 3,
        },
        {
          teacher: 2,
          date: now - 1000 * 60 * 60 * 24 * 10,
        },
        {
          teacher: 4,
          date: now - 1000 * 60 * 60 * 24 * 4,
        },
        {
          teacher: 6,
          date: now - 1000 * 60 * 60 * 24 * 16,
        },
        {
          date: now - 1000 * 60 * 60 * 24 * 2,
          teacher: 3,
        },
        {
          date: now + 60 * 60 * 1000,
          teacher: 2,
        },
        {
          date: now + 1000 * 60 * 60 * 24 * 2,
          teacher: 1,
        },
        {
          date: now + 1000 * 60 * 60 * 24 * 4,
          teacher: 5,
        },
        {
          date: now - 1000 * 60 * 60 * 24 * 3,
          teacher: 7,
        },
      ]);
    });
  });
};
