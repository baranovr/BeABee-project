interface ResultStatus {
  id: number;
  name: string;
  desc: string;
}

export const patientResultStatus: ResultStatus[] = [
  {
    id: 1,
    name: 'medical-dashboard.patientResults.patientAdmission.title',
    desc: 'medical-dashboard.patientResults.patientAdmission.description',
  },
  {
    id: 2,
    name: 'medical-dashboard.patientResults.examStarts.title',
    desc: 'medical-dashboard.patientResults.examStarts.description',
  },
  {
    id: 3,
    name: 'medical-dashboard.patientResults.patientDischarge.title',
    desc: 'medical-dashboard.patientResults.patientDischarge.description',
  },
];
