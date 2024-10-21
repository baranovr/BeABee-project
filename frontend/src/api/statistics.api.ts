export interface Statistic {
  id: number;
  value: number;
  prevValue: number;
  unit: '%';
}

export const getStatistics = (): Promise<Statistic[]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res([
        {
          id: 1,
          value: 45,
          prevValue: 30,
          unit: '%',
        },
        {
          id: 2,
          value: 12,
          prevValue: 20,
          unit: '%',
        },
        {
          id: 3,
          value: 90,
          prevValue: 60,
          unit: '%',
        },
        {
          id: 4,
          value: 78,
          prevValue: 90,
          unit: '%',
        },
      ]);
    }, 0);
  });
};
