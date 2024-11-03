// mainpageDashboard.api.ts

import { getNewsList } from '@app/api/recentlynews.api';

export interface News {
  file: string;
  title: string;
  description: string;
  created_at: number;
  posted_by: string;
  avatar: string;
}
export const getRecentlyAddedNews = async (): Promise<News[]> => {
  try {
    const recentlyNews = await getNewsList();

    return recentlyNews.map(
      (news): News => ({
        title: news.title,
        posted_by: news.posted_by,
        created_at: news.created_at,
        description: news.description,
        file: news.file,
        avatar: news.avatar,
      }),
    );
  } catch (error) {
    console.error('Error fetching recently news:', error);
    throw error;
  }
};
