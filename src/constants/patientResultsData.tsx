interface Result {
  id: number;
  status: number;
  date: string | number;
  isActive: boolean;
}

export const patientResultsData: Array<Result> = [
  {
    id: 1,
    status: 1,
    date: Date.now(),
    isActive: true,
  },
  {
    id: 2,
    status: 2,
    date: '02.15.2024',
    isActive: false,
  },
  {
    id: 3,
    status: 3,
    date: '11.02.2023',
    isActive: false,
  },
];
