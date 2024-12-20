// BaseArticle.styles.ts

import styled from 'styled-components';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { BaseTypography } from '../BaseTypography/BaseTypography';

export const Header = styled.div`
  height: 5.5rem;
  margin-left: 1.5625rem;
  display: flex;
  align-items: center;
`;

export const AuthorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.625rem;
`;

export const DeletePostButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--secondary-background-color);;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0; /* По умолчанию скрыта */
    visibility: hidden; /* Полностью исключаем из отображения */

    transition: opacity 0.3s ease, visibility 0.3s ease; /* Анимация появления */

    &:hover {
        background: rgba(0, 0, 0, 0.18); /* Более тёмный цвет при наведении */
    }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 21.25rem;
  position: relative;
  max-width: 42.5rem;
  box-shadow: var(--box-shadow);
  border-radius: ${BORDER_RADIUS};
  transition: 0.3s;

  [data-theme='dark'] & {
    background: var(--secondary-background-color);
  }

  &:hover {
    box-shadow: var(--box-shadow-hover);
  }
  
  &:hover ${DeletePostButton} {
    opacity: 1; /* Показываем кнопку при наведении */
    visibility: visible;
  }  
`;

export const Author = styled.div`
  font-size: ${FONT_SIZE.lg};
  font-weight: ${FONT_WEIGHT.bold};
  color: var(--text-main-color);
  line-height: 1.5625rem;
`;

export const InfoWrapper = styled.div`
  padding: 1.25rem;

  @media only screen and ${media.xl} {
    padding: 1rem;
  }

  @media only screen and ${media.xxl} {
    padding: 1.85rem;
  }
`;

export const InfoHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;

  @media only screen and ${media.md} {
    margin-bottom: 0.625rem;
  }

  @media only screen and ${media.xxl} {
    margin-bottom: 1.25rem;
  }
`;

export const Title = styled.div`
  font-size: ${FONT_SIZE.xl};
  font-weight: ${FONT_WEIGHT.semibold};
  width: 80%;
  line-height: 1.375rem;
  white-space: pre-wrap;
  word-break: break-word;  

  color: var(--text-main-color);

  @media only screen and ${media.md} {
    font-size: ${FONT_SIZE.xxl};
  }
`;

export const DateTime = styled(BaseTypography.Text)`
  font-size: ${FONT_SIZE.xs};
  color: var(--text-main-color);
  line-height: 1.25rem;
`;

export const Description = styled.div`
  font-size: ${FONT_SIZE.xs};
  color: var(--text-main-color);
  white-space: pre-wrap;
  word-break: break-word;

  @media only screen and ${media.xxl} {
    font-size: 1rem;
  }
`;

export const Detail = styled.div`
  font-size: ${FONT_SIZE.xs};
  color: #2aabd2;
  margin-top: 0.5rem;

  &:first-of-type {
    margin-top: 1rem;
  }

  @media only screen and ${media.xxl} {
    font-size: 1rem;
  }
`;

export const TaskWrapper = styled.div`
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: ${BORDER_RADIUS};
  margin-top: 1rem;

  @media only screen and ${media.xl} {
    padding: 1rem;
  }

  @media only screen and ${media.xxl} {
    padding: 1.85rem;
  }
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 6rem;
  right: 1rem;
  background-color: var(--secondary-background-color);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: translateY(-5rem);
  transition: all 0.3s ease;
  color: var(--text-main-color);

  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
`;

export const WrapperNoImg = styled(Wrapper)`
  position: relative;

  &:hover {
    ${DeleteButton} {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
