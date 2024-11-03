import { ActivityStatusType } from '@app/interfaces/interfaces';
import { getUsersList } from '@app/api/users.api';
import { getImportantInfoList } from '@app/api/importantinfo.api';

export interface Activity {
  image: string;
  title: string;
  status: ActivityStatusType;
  date: number;
  owner: string;
}

export interface ImportantInfo {
  title: string;
  owner: string;
  image: string;
  description: string;
  created_at: number;
  avatar: string;
}

export interface UserActivity {
  avatar: string;
  full_name: string;
  status_in_service: string;
  date_joined: string;
  group: string;
}

export const getUserActivities = async (): Promise<UserActivity[]> => {
  const users = await getUsersList();
  return users.map((user: any) => ({
    avatar: user.avatar,
    full_name: user.full_name,
    status_in_service: user.status_in_service,
    date_joined: user.date_joined,
    group: user.group,
  }));
};

export const getTrendingActivities = async (): Promise<ImportantInfo[]> => {
  try {
    const importantInfos = await getImportantInfoList();

    return importantInfos.map(
      (info): ImportantInfo => ({
        title: info.title,
        owner: info.owner,
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

export const getActivities = (): Promise<Activity[]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res([
        {
          image: process.env.REACT_APP_ASSETS_BUCKET + '/lightence-activity/unsplash_d2w-_1LJioQ_urzhuj.webp',
          title: 'Yellow Light',
          status: 'sold',
          date: Date.now() - 1000 * 60 * 24,
          owner: '@chingu98',
        },
        {
          image: process.env.REACT_APP_ASSETS_BUCKET + '/lightence-activity/unsplash_1rBg5YSi00c_1_mpz3a7.webp',
          title: 'Cult of Nature',
          status: 'added',
          date: Date.now() - 1000 * 60 * 60 * 2,
          owner: '@azukaru1X',
        },
        {
          image: process.env.REACT_APP_ASSETS_BUCKET + '/lightence-activity/unsplash_GfQEdpIkkuw_vid9mb.webp',
          title: 'Match the Eyes',
          status: 'booked',
          date: Date.now() - 1000 * 60 * 60 * 22,
          owner: '@samsam',
        },
        {
          image: process.env.REACT_APP_ASSETS_BUCKET + '/lightence-activity/unsplash_3MAmj1ZKSZA_rfbw6u.webp',
          title: 'Plan A & CUSTOM X3',
          status: 'sold',
          date: Date.now() - 1000 * 60 * 60 * 8,
          owner: '@mikke_swar',
        },
      ]);
    }, 1000);
  });
};
