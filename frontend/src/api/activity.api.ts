
import { getUsersList } from '@app/api/users.api';
import { getImportantInfoList } from '@app/api/importantinfo.api';

export interface UserActivity {
  id: number;
  avatar: string;
  nickname: string;
  full_name: string;
  status_in_service: string;
  date_joined: string;
  group: string;
  is_banned: boolean;
  ban_reason: string;
  onDeleteSuccess?: () => void;
}

export const getUserActivities = async (): Promise<UserActivity[]> => {
  const users = await getUsersList();
  return users.map((user: any) => ({
    id: user.id,
    avatar: user.avatar,
    nickname: user.nickname,
    full_name: user.full_name,
    status_in_service: user.status_in_service,
    date_joined: user.date_joined,
    group: user.group,
    is_banned: user.is_banned,
    ban_reason: user.ban_reason,
  }));
};

export interface ImportantInfo {
  id: number;
  title: string;
  owner: string;
  status_in_service: string;
  image: string;
  description: string;
  created_at: number;
  avatar: string;
}

export const getImportantInfo = async (): Promise<ImportantInfo[]> => {
  try {
    const importantInfos = await getImportantInfoList();

    return importantInfos.map(
      (info): ImportantInfo => ({
        id: info.id,
        title: info.title,
        owner: info.owner,
        status_in_service: info.status_in_service,
        created_at: info.created_at,
        description: info.description,
        image: info.image,
        avatar: info.avatar,
      }),
    );
  } catch (error) {
    console.error('Error fetching important info:', error);
    throw error;
  }
};
