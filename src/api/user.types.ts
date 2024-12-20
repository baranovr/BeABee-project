export interface UserInList {
  id: number;
  avatar: string;
  first_name: string;
  full_name: string;
  email: string;
  status_in_service: ServiceStatus;
  date_joined: string;
  group: GroupType;
}

export type ServiceStatus = 'Creator' | 'Admin' | 'User';

export type GroupType = 'CS-31' | 'CS-32' | 'CS-33' | 'CS-34' | 'CS-41' | 'CS-42' | 'CS-43' | 'CS-44';
