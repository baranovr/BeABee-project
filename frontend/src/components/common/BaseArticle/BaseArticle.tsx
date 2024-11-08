// BaseArticle.tsx

import React from 'react';
import { Dates } from '@app/constants/Dates';
import { BaseImage } from '../BaseImage/BaseImage';
import { BaseAvatar } from '../BaseAvatar/BaseAvatar';
import * as S from './BaseArticle.styles';

export interface BaseArticleProps {
  author?: React.ReactNode;
  imgUrl: string;
  title: string;
  date: number | string;
  description: string;
  avatar?: string;
  className?: string;
}

export interface BaseArticlePropsNoImg {
  author?: React.ReactNode;
  title: string;
  date: number | string;
  description: string;
  avatar?: string;
  className?: string;
}

export const BaseArticle: React.FC<BaseArticleProps> = ({
  imgUrl,
  title,
  date,
  description,
  author,
  avatar,
  className,
}) => {
  return (
    <S.Wrapper className={className}>
      <S.Header>
        {!!avatar && <BaseAvatar src={avatar} alt="author" size={43} />}
        <S.AuthorWrapper>
          {author && <S.Author>{author}</S.Author>}
          <S.DateTime>{Dates.format(date, 'L')}</S.DateTime>
        </S.AuthorWrapper>
      </S.Header>
      <BaseImage src={imgUrl} alt="article" preview={false} />
      <S.InfoWrapper>
        <S.InfoHeader>
          <S.Title>{title}</S.Title>
        </S.InfoHeader>
        <S.Description>{description}</S.Description>
      </S.InfoWrapper>
    </S.Wrapper>
  );
};

export const BaseArticleNoImg: React.FC<BaseArticlePropsNoImg> = ({
  title,
  date,
  description,
  author,
  avatar,
  className,
}) => {
  return (
    <S.Wrapper className={className}>
      <S.Header>
        {!!avatar && <BaseAvatar src={avatar} alt="author" size={43} />}
        <S.AuthorWrapper>
          {author && <S.Author>{author}</S.Author>}
          <S.DateTime>{Dates.format(date, 'L')}</S.DateTime>
        </S.AuthorWrapper>
      </S.Header>
      <S.InfoWrapper>
        <S.InfoHeader>
          <S.Title>{title}</S.Title>
        </S.InfoHeader>
        <S.Description>{description}</S.Description>
      </S.InfoWrapper>
    </S.Wrapper>
  );
};
