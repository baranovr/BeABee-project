import React, { useEffect, useState } from 'react';
import { BaseArticle } from '@app/components/common/BaseArticle/BaseArticle';
import { BaseFeed } from '@app/components/common/BaseFeed/BaseFeed';
import { PostsFilter } from '@app/components/apps/newsFeed/NewsFilter/PostsFilter';
import { getPosts, Post } from '@app/api/posts.api';
import { BaseEmpty } from '@app/components/common/BaseEmpty/BaseEmpty';

export const PostsFeed: React.FC = () => {
  const [news, setNews] = useState<Post[]>([]); // Список постов
  const [hasMore] = useState<boolean>(true); // Для бесконечной прокрутки
  const [loaded, setLoaded] = useState<boolean>(false); // Индикатор загрузки

  // Загрузка постов
  const refreshPosts = () => {
    getPosts()
      .then(setNews)
      .catch((error) => {
        console.error('Failed to load posts:', error);
      })
      .finally(() => setLoaded(true)); // Устанавливаем, что данные загружены
  };

  // Загрузка дополнительных постов (для пагинации)
  const next = () => {
    getPosts().then((newPosts) => setNews(news.concat(newPosts)));
  };

  // Изначальная загрузка постов
  useEffect(() => {
    refreshPosts();
  }, []);

  return (
    <PostsFilter news={news}>
      {({ filteredNews }) =>
        filteredNews?.length || !loaded ? (
          <BaseFeed next={next} hasMore={hasMore}>
            {filteredNews.map((post) => (
              <BaseArticle key={post.id} post={post} onDeleteSuccess={refreshPosts} />
            ))}
          </BaseFeed>
        ) : (
          <BaseEmpty />
        )
      }
    </PostsFilter>
  );
};
