// TrendingCollection.styles.ts

import styled from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { NFTCard } from '@app/components/nft-dashboard/common/NFTCard/NFTCard';
import { FONT_SIZE, FONT_WEIGHT, FONT_FAMILY, media, BORDER_RADIUS } from '@app/styles/themes/constants';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import { Modal as AntdModal } from 'antd';

interface CardInternalProps {
  $img: string;
}

export const StyledModal = styled(AntdModal)`
  .ant-modal-content {
    border-radius: ${BORDER_RADIUS};
    background-color: rgba(0, 0, 0, 0.2);
    color: var(--text-primary-color);
  }

  .ant-modal-header {
    border-bottom: none;
    background-color: rgba(0, 0, 0, 0.2);
    border-top-left-radius: ${BORDER_RADIUS};
    border-top-right-radius: ${BORDER_RADIUS};
    padding: 16px;
  }

  .ant-modal-title {
    font-size: ${FONT_SIZE.lg};
    font-weight: ${FONT_WEIGHT.bold};
    color: var(--text-secondary-color);
  }

  .ant-modal-close {
    color: var(--text-secondary-color);
    font-size: ${FONT_SIZE.md};
  }

  .ant-modal-body {
    padding: 24px;
    font-size: ${FONT_SIZE.md};
    line-height: 1.5;
    color: var(--text-primary-color);
    background-color: rgba(0, 0, 0, 0.2);
  }

  .ant-modal-footer {
    border-top: none;
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    background-color: rgba(0, 0, 0, 0.2);

    button {
      border-radius: ${BORDER_RADIUS};
      font-size: ${FONT_SIZE.md};
      padding: 6px 12px;
    }
  }
`;

export const CollectionImage = styled.img`
  animation: imgOut 0.5s;
  width: 100%;
  height: 126px;
  object-fit: cover;
  border-top-left-radius: ${BORDER_RADIUS};
  border-top-right-radius: ${BORDER_RADIUS};
`;

export const NftCollectionInfo = styled.div`
  position: relative;
  padding: 2rem 1.25rem 1.5rem;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:not(:last-of-type) {
    margin-bottom: 0.1rem;
  }
`;

export const Title = styled(BaseTypography.Title)`
  transition: all 0.5s ease;

  &.ant-typography {
    margin-bottom: 0;

    font-size: ${FONT_SIZE.md};
  }
`;

export const Text = styled(BaseTypography.Text)`
  transition: all 0.5s ease;

  font-size: ${FONT_SIZE.xs};

  font-weight: ${FONT_WEIGHT.semibold};
`;

export const OwnerText = styled(Text)`
  letter-spacing: 0.02em;

  font-size: ${FONT_SIZE.xxs};

  font-weight: ${FONT_WEIGHT.regular};

  font-family: ${FONT_FAMILY.secondary};

  color: var(--text-nft-light-color);

  @media only screen and ${media.xl} {
    font-size: ${FONT_SIZE.xs};
  }
`;

export const USDText = styled(BaseTypography.Text)`
  transition: all 0.5s ease;

  font-weight: ${FONT_WEIGHT.semibold};

  font-size: ${FONT_SIZE.xs};
`;

export const AuthorAvatarWrapper = styled.div`
  transition: all 0.5s ease;
  position: absolute;
  top: -45px;
  border-radius: 50%;

  border: 2px solid var(--text-secondary-color);
`;

export const BidButton = styled(BaseButton)`
  transition: all 0.5s ease;
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 14px;

  color: var(--text-secondary-color);

  border-color: var(--text-secondary-color);

  font-size: ${FONT_SIZE.md};
`;

export const BidButtonDelete = styled(BaseButton)`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 8px;

  color: red;

  border-color: red;

  font-size: ${FONT_SIZE.xxs};
`;


export const Card = styled(NFTCard)<CardInternalProps>`
  overflow: hidden;

  &:hover {
    & {
      background: ${(props) => `url(${props.$img})`};
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    ${CollectionImage} {
      animation: imgIn 0.5s;
      animation-fill-mode: forwards;
    }

    ${Title}, ${Text}, ${USDText} {
      color: var(--text-secondary-color);
    }

    ${AuthorAvatarWrapper} {
      transform: translateY(10px) translateX(-10px) scale(0.6);
    }

    ${BidButton} {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(1.1);
      position: absolute;
    }
  }

  @keyframes imgIn {
    99% {
      transform: scale(2);
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes imgOut {
    0% {
      transform: scale(2);
    }

    100% {
      transform: scale(1);
    }
  }
`;
