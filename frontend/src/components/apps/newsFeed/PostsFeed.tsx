// PostsFeed.tsx

import React, {useEffect, useState} from 'react';
import { BaseArticle } from '@app/components/common/BaseArticle/BaseArticle';
import { BaseFeed } from '@app/components/common/BaseFeed/BaseFeed';
import { PostsFilter } from '@app/components/apps/newsFeed/NewsFilter/PostsFilter';
import { getPosts, Post } from '@app/api/posts.api';
import { BaseEmpty } from '@app/components/common/BaseEmpty/BaseEmpty';

export const PostsFeed: React.FC = () => {
  const [news, setNews] = useState<Post[]>([]);
  const [hasMore] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    getPosts()
      .then((res) => setNews(res))
      .finally(() => setLoaded(true));
  }, []);

  const next = () => {
    getPosts().then((newPosts) => setNews(news.concat(newPosts)));
  };

  return (
    <PostsFilter news={news}>
      {({ filteredNews }) =>
        filteredNews?.length || !loaded ? (
          <BaseFeed next={next} hasMore={hasMore}>
            {filteredNews.map((post, index) => (
              <BaseArticle
                key={index}
                title={post.title}
                description={post.description}
                date={post.created_at}
                imgUrl={post.photo}
                author={post.user}
                avatar={post.avatar}
              />
            ))}
          </BaseFeed>
        ) : (
          <BaseEmpty />
        )
      }
    </PostsFilter>
  );
};
