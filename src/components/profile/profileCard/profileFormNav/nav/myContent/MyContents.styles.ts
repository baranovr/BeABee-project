import styled from 'styled-components';
import { Card } from 'antd';

export const ContentCard = styled(Card)`
  width: 100%;
  transition: all 0.3s ease;
`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
`;

export const ContentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
`;
export const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const NewsCard = styled(Card)`
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }
`;

export const NewsImage = styled.img`
  height: 12rem;
  width: 100%;
  object-fit: cover;
`;

export const NewsContent = styled.div`
  padding: 1rem;
`;

export const NewsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const NewsDescription = styled.p`
    color: rgb(150, 176, 209);
    margin-bottom: 1rem;
`;

export const NewsCreatedAt = styled.p`
    color: rgb(55, 250, 255);
    margin-bottom: 1rem;
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid red;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: red;
  z-index: 10;
  opacity: 1;

  &:hover {
    background-color: red;
    color: white;
  }
`;
