import React from 'react';
import * as S from './References.styles';
import { GithubOutlined, LinkedinOutlined } from '@ant-design/icons';

export const References: React.FC = () => {
  return (
    <S.ReferencesWrapper>
      <S.Text>
        Made by{' '}
        <a href="https://github.com/baranovr" target="_blank" rel="noreferrer">
          baranovr{' '}
        </a>
        in 2024 &copy;. Based on{' '}
        <a href="https://ant.design/" target="_blank" rel="noreferrer">
          Ant-design.
        </a>
      </S.Text>
      <S.Icons>
        <a href="https://github.com/baranovr" target="_blank" rel="noreferrer">
          <GithubOutlined />
        </a>
        <a href="https://www.linkedin.com/in/ruslan-baranov-2b75902bb/" target="_blank" rel="noreferrer">
          <LinkedinOutlined />
        </a>
      </S.Icons>
    </S.ReferencesWrapper>
  );
};
