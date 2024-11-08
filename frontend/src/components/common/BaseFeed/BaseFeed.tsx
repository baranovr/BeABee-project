// BaseFeed.tsx

import React from 'react';
import { BaseSpin } from '../BaseSpin/BaseSpin';
import * as S from './BaseFeed.styles';

export interface BaseFeedProps {
  next: () => void;
  hasMore: boolean;
  children: React.ReactNode[];
  target?: string;
}

export const BaseFeed: React.FC<BaseFeedProps> = ({ next, hasMore, target = 'main-content', children }) => {
  return (
      <S.NewsWrapper>{children}</S.NewsWrapper>
  );
};
