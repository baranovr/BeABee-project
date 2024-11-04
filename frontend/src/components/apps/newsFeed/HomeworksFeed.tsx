import React, { useEffect, useState } from 'react';
import { BaseArticle } from '@app/components/common/BaseArticle/BaseArticle';
import { BaseFeed } from '@app/components/common/BaseFeed/BaseFeed';
import { HomeworksFilter } from '@app/components/apps/newsFeed/HomeworksFilter/HomeworksFilter';

import { BaseEmpty } from '@app/components/common/BaseEmpty/BaseEmpty';
import { getHomeworks, Homework } from '@app/api/homeworks.api';
import { getHomeworksList } from '@app/constants/dashboardHomeworks';

export const HomeworksFeed: React.FC = () => {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [hasMore] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    getHomeworksList()
      .then((res) => setHomeworks(res))
      .finally(() => setLoaded(true));
  }, []);

  const next = () => {
    getHomeworks().then((newHomeworks) => setHomeworks(homeworks.concat(newHomeworks)));
  };

  return (
    <HomeworksFilter news={homeworks}>
      {({ filteredNews }) =>
        filteredNews?.length || !loaded ? (
          <BaseFeed next={next} hasMore={hasMore}>
            {filteredNews.map((post, index) => (
              <BaseArticle
                key={index}
                title={post.title}
                description={post.description}
                date={post.created_at}
                imgUrl={post.file}
                author={post.teacher}
                avatar={post.teacher_avatar}
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
