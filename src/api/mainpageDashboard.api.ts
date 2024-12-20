// mainpageDashboard.api.ts

import { getNewsList } from '@app/api/recentlynews.api';

export interface News {
  id: number;
  file: string;
  title: string;
  description: string;
  created_at: number;
  posted_by_id: number;
  posted_by: string;
  status_in_service: string;
  avatar: string;
}
export const getRecentlyAddedNews = async (): Promise<News[]> => {
  try {
    const recentlyNews = await getNewsList();

    return recentlyNews.map(
      (news): News => ({
        id: news.id,
        title: news.title,
        posted_by_id: news.posted_by_id,
        posted_by: news.posted_by,
        status_in_service: news.status_in_service,
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
