import React, { useEffect, useState } from 'react';
import { BaseArticle } from '@app/components/common/BaseArticle/BaseArticle';
import { BaseFeed } from '@app/components/common/BaseFeed/BaseFeed';
import { HomeworksFilter } from '@app/components/apps/newsFeed/HomeworksFilter/HomeworksFilter';
import { getNews, Post } from '@app/api/homeworks.api';
import { BaseEmpty } from '@app/components/common/BaseEmpty/BaseEmpty';

export const HomeworksFeed: React.FC = () => {
  const [news, setNews] = useState<Post[]>([]);
  const [hasMore] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    getNews()
      .then((res) => setNews(res))
      .finally(() => setLoaded(true));
  }, []);

  const next = () => {
    getNews().then((newNews) => setNews(news.concat(newNews)));
  };

  return (
    <HomeworksFilter news={news}>
      {({ filteredNews }) =>
        filteredNews?.length || !loaded ? (
          <BaseFeed next={next} hasMore={hasMore}>
            {filteredNews.map((post, index) => (
              <BaseArticle
                key={index}
                title={post.title}
                description={post.text}
                date={post.date}
                imgUrl={post.img}
                author={post.author}
                avatar={post.avatarUrl}
              />
            ))}
          </BaseFeed>
        ) : (
          <BaseEmpty />
        )
      }
    </HomeworksFilter>
  );
};
