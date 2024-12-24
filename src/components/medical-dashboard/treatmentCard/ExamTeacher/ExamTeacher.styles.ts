// ExamTeacher.styles.ts

import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import styled from 'styled-components';
import { BaseCard } from '../../../common/BaseCard/BaseCard';

export const DeleteButton = styled.button`
  position: absolute;
  top: 1rem;
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
  transform: translateX(1rem);
  transition: all 0.3s ease;
  color: var(--text-main-color);

  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
`;

export const TeacherCardWrapper = styled.div`
  position: relative;
  width: fit-content;

  &:hover {
    ${DeleteButton} {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

export const TeacherName = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

export const TeacherCard = styled(BaseCard)`
  background: linear-gradient(to bottom, var(--primary-color) 5rem, var(--secondary-background-color) 5rem);
`;

export const TeacherCardBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const LabelCol = styled(BaseCol)`
  opacity: 0.5;
`;

export const ValueCol = styled(BaseCol)``;

export const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-main-color);

  svg {
    color: var(--warning-color);
  }
`;

export const ModalWarning = styled.h5`
  margin-top: 1rem;
  color: var(--text-secondary-color);
  font-size: 0.875rem;
  line-height: 1.5;
`;
