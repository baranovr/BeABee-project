// PostsFilter.ts

import React, { ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RangeValue } from 'rc-picker/lib/interface.d';
import { AuthorValidator, TitleValidator, DatesValidator } from '../Validator';
import { useResponsive } from '@app/hooks/useResponsive';
import { AppDate, Dates } from '@app/constants/Dates';
import { Post } from '@app/api/posts.api';
import * as S from './PostsFilter.styles';
import { BaseDropdown } from '@app/components/common/BaseDropdown/Dropdown';

interface PostsFilterProps {
  news: Post[];
  children: ({ filteredNews }: { filteredNews: Post[] }) => ReactNode;
}

interface Filter {
  author: string;
  title: string;
  dates: [AppDate | null, AppDate | null];
  updateFilteredField: (field: string, value: [AppDate | null, AppDate | null] | string) => void;
  onApply: () => void;
  onReset: () => void;
}

const Filter: React.FC<Filter> = ({
  author,
  title,
  dates,
  onApply,
  onReset,
  updateFilteredField,
}) => {
  const { t } = useTranslation();
  const { mobileOnly } = useResponsive();

  const applyFilter = () => {
    onApply();
  };

  const resetFilter = () => {
    onReset();
  };

  return (
    <S.FilterWrapper>
      {!mobileOnly && <S.FilterTitle>{t('newsFeed.filter')}</S.FilterTitle>}

      <S.InputWrapper>
        <S.SearchIcon />
        <S.Input
          placeholder={t('newsFeed.authorSearch')}
          value={author}
          onChange={(event) => updateFilteredField('author', event.target.value)}
        />
      </S.InputWrapper>

      <S.InputWrapper>
        <S.SearchIcon />
        <S.Input
          placeholder={t('newsFeed.titleSearch')}
          value={title}
          onChange={(event) => updateFilteredField('title', event.target.value)}
        />
      </S.InputWrapper>

      <S.DateLabels>
        <S.DateLabel>{t('newsFeed.from')}</S.DateLabel>
        <S.DateLabel>{t('newsFeed.to')}</S.DateLabel>
      </S.DateLabels>

      <S.RangePicker
        popupClassName="range-picker"
        value={dates}
        onChange={(dates: RangeValue<AppDate>) =>
          updateFilteredField('dates', [dates?.length ? dates[0] : null, dates?.length ? dates[1] : null])
        }
      />

      <S.BtnWrapper>
        <S.Btn onClick={() => resetFilter()}>{t('newsFeed.reset')}</S.Btn>
        <S.Btn onClick={() => applyFilter()} type="primary">
          {t('newsFeed.apply')}
        </S.Btn>
      </S.BtnWrapper>
    </S.FilterWrapper>
  );
};

export const PostsFilter: React.FC<PostsFilterProps> = ({ news, children }) => {
  const [filterFields, setFilterFields] = useState<{
    author: string;
    title: string;
    dates: [AppDate | null, AppDate | null];
  }>({
    author: '',
    title: '',
    dates: [null, null],
  });
  const { author, title, dates } = filterFields;
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(news);
  const [overlayOpen, setOverlayOpen] = useState<boolean>(false);
  const { mobileOnly } = useResponsive();
  const { t } = useTranslation();

  const filterNews = useCallback(
    (isReset = false) => {
      let updatedNews = [...news];
      if ((author || title || dates[0]) && !isReset) {
        updatedNews = news.filter((post) => {
          const postAuthor = post.user.toLowerCase();
          const enteredAuthor = author.toLowerCase();
          const postTitle = post.title.toLowerCase();
          const enteredTitle = title.toLowerCase();
          const postDate = Dates.getDate(post.created_at);

          const fieldsValidators = [
            new AuthorValidator(postAuthor, enteredAuthor),
            new TitleValidator(postTitle, enteredTitle),
            new DatesValidator(postDate, dates),
          ];

          return fieldsValidators.map((validator) => validator.validate()).every((i) => i);
        });
      }
      setFilteredPosts(
        updatedNews.sort((a, b) => {
          return b.created_at - a.created_at;
        }),
      );
    },
    [news, author, title, dates],
  );

  useEffect(() => {
    setFilteredPosts(news);
    filterNews(false);
  }, [news, filterNews]);

  const handleClickApply = useCallback(() => {
    filterNews(false);

    if (mobileOnly) {
      setOverlayOpen(false);
    }
  }, [mobileOnly, filterNews]);

  const handleClickReset = useCallback(() => {
    setFilterFields({ author: '', title: '', dates: [null, null] });
    filterNews(true);

    if (mobileOnly) {
      setOverlayOpen(false);
    }
  }, [filterNews, mobileOnly]);

  const updateFilteredField = (field: string, value: string | [AppDate | null, AppDate | null]) => {
    setFilterFields({ ...filterFields, [field]: value });
  };

  return (
    <>
      <S.TitleWrapper>
        {mobileOnly && (
          <S.FilterPopover
            trigger="click"
            open={overlayOpen}
            onOpenChange={(open) => setOverlayOpen(open)}
            content={
              <Filter
                author={author}
                title={title}
                dates={dates}
                onApply={handleClickApply}
                onReset={handleClickReset}
                updateFilteredField={updateFilteredField}
              />
            }
          >
            <S.FilterButton>{t('newsFeed.filter')}</S.FilterButton>
          </S.FilterPopover>
        )}
      </S.TitleWrapper>

      <S.ContentWrapper>
        <S.NewsWrapper>{children({ filteredNews: filteredPosts || news })}</S.NewsWrapper>

        {!mobileOnly && (
          <Filter
            author={author}
            title={title}
            dates={dates}
            onApply={handleClickApply}
            onReset={handleClickReset}
            updateFilteredField={updateFilteredField}
          />
        )}
      </S.ContentWrapper>
    </>
  );
};
