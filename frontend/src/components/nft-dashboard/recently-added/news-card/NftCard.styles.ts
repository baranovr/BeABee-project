import styled from 'styled-components';
import { NFTCard } from '@app/components/nft-dashboard/common/NFTCard/NFTCard';
import { Button as AntButton } from 'antd';
import { FONT_SIZE, FONT_WEIGHT, FONT_FAMILY, media, BREAKPOINTS, BORDER_RADIUS } from '@app/styles/themes/constants';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import { Modal as AntdModal } from 'antd';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

interface CardInternalProps {
  $img: string;
}

export const NftImage = styled.img`
  animation: imgOut 0.5s;
  width: 100%;
  height: 195px;
  object-fit: cover;
  border-top-left-radius: ${BORDER_RADIUS};
  border-top-right-radius: ${BORDER_RADIUS};
`;

export const Title = styled(BaseTypography.Title)`
  position: relative;
  animation: titleOut 0.5s;

  &.ant-typography {
    margin-bottom: 0;

    font-size: ${FONT_SIZE.md};
  }
`;

export const NftInfo = styled.div`
  padding: 1rem 1.25rem 1.5rem;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.625rem;

  @media only screen and (max-width: ${BREAKPOINTS.md - 0.02}px) {
    &:first-of-type {
      margin-bottom: 0;
    }
  }

  @media only screen and ${media.md} {
    margin-bottom: 0.25rem;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const InfoHeader = styled.div`
  margin-bottom: 1rem;
`;

export const InfoFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const InfoText = styled.span`
  display: block;
  transition: all 0.5s ease;
  letter-spacing: 0.02em;

  font-weight: ${FONT_WEIGHT.regular};

  font-size: ${FONT_SIZE.xxs};

  font-family: ${FONT_FAMILY.secondary};

  color: var(--text-nft-light-color);

  @media only screen and ${media.xl} {
    font-size: ${FONT_SIZE.xs};
  }
`;

export const CurrentBid = styled(InfoText)`
  font-family: ${FONT_FAMILY.secondary};

  color: var(--text-main-color);
`;

export const BidCrypto = styled.span`
  transition: all 0.5s ease;

  font-size: ${FONT_SIZE.xs};

  @media only screen and ${media.xl} {
    font-size: ${FONT_SIZE.md};
  }
`;
styled(CurrentBid)`
  font-size: ${FONT_SIZE.xs};

  color: var(--text-main-color);

  font-weight: ${FONT_WEIGHT.semibold};

  font-family: ${FONT_FAMILY.main};

  @media only screen and ${media.xl} {
    font-size: ${FONT_SIZE.md};
  }
`;
export const ViewButton = styled(BaseButton)`
  transition: all 0.5s ease;
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 14px;
  color: var(--text-secondary-color);
  border-color: var(--text-secondary-color);
  font-size: ${FONT_SIZE.md};
  z-index: 1;
`;

export const Button = styled(AntButton)`
  border-radius: ${BORDER_RADIUS};
`;

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

    ${NftImage} {
      animation: imgIn 0.5s;
      animation-fill-mode: forwards;
    }

    ${Title} {
      color: var(--text-secondary-color);
    }

    ${ViewButton} {
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

export const Description = styled(BaseTypography.Text)`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--text-main-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Date = styled(BaseTypography.Text)`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--text-light-color);
`;

export const AuthorAvatar = styled.img`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid var(--background-color);
`;
styled(AntdModal)`
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
