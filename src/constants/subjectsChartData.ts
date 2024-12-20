export interface SubjectFactor {
  value: number;
  name: string;
  description: string;
}

export const subjectsChartData: SubjectFactor[] = [
  {
    value: 50,
    name: 'medical-dashboard.subjects.lifestyle.title',
    description: 'medical-dashboard.subjects.lifestyle.description',
  },
  {
    value: 20,
    name: 'medical-dashboard.subjects.ecology.title',
    description: 'medical-dashboard.subjects.ecology.description',
  },
  {
    value: 20,
    name: 'medical-dashboard.subjects.genetics.title',
    description: 'medical-dashboard.subjects.genetics.description',
  },
  {
    value: 10,
    name: 'medical-dashboard.subjects.medicine.title',
    description: 'medical-dashboard.subjects.medicine.description',
  },
];
