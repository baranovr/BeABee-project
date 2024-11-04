import React, { ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RangeValue } from 'rc-picker/lib/interface.d';
import { BaseHashTag, IHashTag } from '@app/components/common/BaseHashTag/BaseHashTag';
import { AuthorValidator, TitleValidator, DatesValidator } from '../Validator';
import { useResponsive } from '@app/hooks/useResponsive';
import { AppDate, Dates } from '@app/constants/Dates';
import { Homework } from '@app/api/homeworks.api';
import * as S from './HomeworksFilter.styles';

interface HomeworksFilterProps {
  news: Homework[];
  newsTags?: IHashTag[];
  children: ({ filteredNews }: { filteredNews: Homework[] }) => ReactNode;
}

interface FilterProps {
  author: string;
  title: string;
  onTagClick: (tag: IHashTag) => void;
  selectedTagsIds: Array<string>;
  selectedTags: IHashTag[];
  dates: [AppDate | null, AppDate | null];
  updateFilteredField: (field: string, value: [AppDate | null, AppDate | null] | string) => void;
  onApply: () => void;
  onReset: () => void;
}

const Filter: React.FC<FilterProps> = ({
  author,
  title,
  onTagClick,
  selectedTags,
  dates,
  onApply,
  onReset,
  updateFilteredField,
}) => {
  const { t } = useTranslation();
  const { mobileOnly } = useResponsive();

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
      {!!selectedTags.length && (
        <S.TagsWrapper>
          {selectedTags.map((tag) => (
            <BaseHashTag key={tag.id} title={tag.title} bgColor={tag.bgColor} removeTag={() => onTagClick(tag)} />
          ))}
        </S.TagsWrapper>
      )}
      <S.DateLabels>
        <S.DateLabel>{t('newsFeed.from')}</S.DateLabel>
        <S.DateLabel>{t('newsFeed.to')}</S.DateLabel>
      </S.DateLabels>
      <S.RangePicker
        popupClassName="range-picker"
        value={dates}
        onChange={(dates: RangeValue<AppDate>) =>
          updateFilteredField('dates', [dates?.[0] || null, dates?.[1] || null])
        }
      />
      <S.BtnWrapper>
        <S.Btn onClick={onReset}>{t('newsFeed.reset')}</S.Btn>
        <S.Btn onClick={onApply} type="primary">
          {t('newsFeed.apply')}
        </S.Btn>
      </S.BtnWrapper>
    </S.FilterWrapper>
  );
};

export const HomeworksFilter: React.FC<HomeworksFilterProps> = ({ news, children }) => {
  const [filterFields, setFilterFields] = useState({
    author: '',
    title: '',
    selectedTags: [] as IHashTag[],
    dates: [null, null] as [AppDate | null, AppDate | null],
  });
  const { author, title, selectedTags, dates } = filterFields;
  const [filteredNews, setFilteredNews] = useState<Homework[]>(news);
  const [overlayOpen, setOverlayOpen] = useState<boolean>(false);
  const { mobileOnly } = useResponsive();
  const { t } = useTranslation();

  const selectedTagsIds = useMemo(() => selectedTags.map((tag) => tag.id), [selectedTags]);

  const onTagClick = useCallback((tag: IHashTag) => {
    setFilterFields((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  }, []);

  const filterNews = useCallback(() => {
    let updatedNews = [...news];

    if (author || title || dates[0] || selectedTags.length) {
      updatedNews = news.filter((post) => {
        const fieldsValidators = [
          new AuthorValidator(post.teacher.toLowerCase(), author.toLowerCase()),
          new TitleValidator(post.title.toLowerCase(), title.toLowerCase()),
          new DatesValidator(Dates.getDate(post.created_at), dates),
        ];

        return fieldsValidators.every((validator) => validator.validate());
      });
    }

    setFilteredNews(updatedNews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  }, [news, author, title, dates, selectedTags]);

  useEffect(() => {
    setFilteredNews(news);
    filterNews();
  }, [news, filterNews]);

  const handleClickApply = useCallback(() => {
    filterNews();
    if (mobileOnly) setOverlayOpen(false);
  }, [filterNews, mobileOnly]);

  const handleClickReset = useCallback(() => {
    setFilterFields({ author: '', title: '', dates: [null, null], selectedTags: [] });
    setFilteredNews(news);
    if (mobileOnly) setOverlayOpen(false);
  }, [news, mobileOnly]);

  const updateFilteredField = (field: string, value: string | [AppDate | null, AppDate | null]) => {
    setFilterFields((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <S.TitleWrapper>
        {mobileOnly && (
          <S.FilterPopover
            trigger="click"
            open={overlayOpen}
            onOpenChange={setOverlayOpen}
            content={
              <Filter
                author={author}
                title={title}
                onTagClick={onTagClick}
                selectedTagsIds={selectedTagsIds}
                selectedTags={selectedTags}
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
        <S.NewsWrapper>{children({ filteredNews: filteredNews || news })}</S.NewsWrapper>
        {!mobileOnly && (
          <Filter
            author={author}
            title={title}
            onTagClick={onTagClick}
            selectedTagsIds={selectedTagsIds}
            selectedTags={selectedTags}
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
