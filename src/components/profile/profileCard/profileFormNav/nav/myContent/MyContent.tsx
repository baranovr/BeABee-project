import React, { useState, useCallback, useEffect } from 'react';
import * as S from './MyContents.styles';
import { Tabs } from './Tabs';
import { notificationController } from '@app/controllers/notificationController';
import axiosInstance from '@app/api/axiosInstance';
import { Loader2, Trash2 } from 'lucide-react';
import { Dates } from '@app/constants/Dates';

interface ContentItem {
  id: number;
  file: string;
  photo: string;
  image: string;
  title: string;
  description: string;
  created_at: string;
}

export const MyContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'infos' | 'posts'>('news');
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<ContentItem[]>([]);

  const loadData = useCallback(async (type: 'news' | 'infos' | 'posts') => {
    try {
      setIsLoading(true);

      switch (type) {
        case 'news': {
          const newsResponse = await axiosInstance.get('user/my_profile/news/');
          setContent(newsResponse.data?.news || []);
          break;
        }
        case 'infos': {
          const infoResponse = await axiosInstance.get('user/my_profile/infos/');
          setContent(infoResponse.data?.infos || []);
          break;
        }
        case 'posts': {
          const postsResponse = await axiosInstance.get('user/my_profile/posts/');
          setContent(postsResponse.data?.posts || []);
          break;
        }
      }
    } catch (error) {
      notificationController.error({
        message: 'Failed to load data! Please try again later!',
      });
      console.error(`Loading ${type} error:`, error);
      setContent([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = useCallback(
    async (id: number, type: 'news' | 'infos' | 'posts') => {
      try {
        setIsLoading(true);

        switch (type) {
          case 'news': {
            await axiosInstance.delete(`platform/news/${id}/`);
            break;
          }
          case 'infos': {
            await axiosInstance.delete(`platform/importantinfo/${id}/`);
            break;
          }
          case 'posts': {
            await axiosInstance.delete(`platform/posts/${id}/`);
            break;
          }
        }

        // Reload the data after successful deletion
        await loadData(type);

        notificationController.success({
          message: 'Item deleted successfully!',
        });
      } catch (error) {
        notificationController.error({
          message: 'Failed to delete item! Please try again later!',
        });
        console.error(`Deleting ${type} item error:`, error);
      } finally {
        setIsLoading(false);
      }
    },
    [loadData],
  );

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, loadData]);

  const renderContentItems = (type: 'news' | 'infos' | 'posts') => {
    return isLoading ? (
      <div className="flex justify-center items-center w-full">
        <Loader2 className="animate-spin" />
      </div>
    ) : content.length > 0 ? (
      content.map((item) => (
        <S.NewsCard key={item.id} className="relative group">
          <S.DeleteButton
            onClick={() => handleDelete(item.id, type)}
            className="group-hover:opacity-100 group-hover:transform-none"
          >
            <Trash2 size={24} />
          </S.DeleteButton>
          <S.NewsImage
            src={type === 'news' ? item.file : type === 'infos' ? item.image || item.photo : item.photo}
            alt={item.title}
          />
          <S.NewsContent>
            <S.NewsTitle>{item.title}</S.NewsTitle>
            <S.NewsDescription>{item.description || 'No description'}</S.NewsDescription>
            <S.NewsCreatedAt>Created at: {Dates.format(item.created_at, 'L') || 'No data'}</S.NewsCreatedAt>
          </S.NewsContent>
        </S.NewsCard>
      ))
    ) : (
      <div className="text-center w-full">No {type} available</div>
    );
  };

  const tabItems = [
    {
      key: 'news',
      label: 'News',
      children: <S.NewsGrid>{renderContentItems('news')}</S.NewsGrid>,
    },
    {
      key: 'infos',
      label: 'Important Info',
      children: <S.NewsGrid>{renderContentItems('infos')}</S.NewsGrid>,
    },
    {
      key: 'posts',
      label: 'Posts',
      children: <S.NewsGrid>{renderContentItems('posts')}</S.NewsGrid>,
    },
  ];

  return (
    <S.ContentCard>
      <S.ContentHeader>
        <S.ContentTitle>My Content</S.ContentTitle>
      </S.ContentHeader>

      <Tabs
        defaultActiveKey="news"
        items={tabItems}
        onChange={(key) => setActiveTab(key as 'news' | 'infos' | 'posts')}
      />
    </S.ContentCard>
  );
};

export default MyContent;
