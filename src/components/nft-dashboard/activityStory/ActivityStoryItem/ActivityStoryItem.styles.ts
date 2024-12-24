import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled, { keyframes, css } from 'styled-components';

const shimmerEffect = keyframes`
  0% { color: #FFD700; }
  25% { color: #FFA500; }
  50% { color: #DAA520; }
  75% { color: #FFA500; }
  100% { color: #FFD700; }
`;

interface StatusProps {
  $color: 'error' | 'warning' | 'success' | 'primary' | 'secondary';
  $role?: 'Creator' | 'Admin' | 'User';
}

export const Title = styled(BaseTypography.Text)`
  font-size: ${FONT_SIZE.xs};
  font-family: ${FONT_FAMILY.secondary};
`;

export const Status = styled(BaseTypography.Text)<StatusProps>`
  font-size: ${FONT_SIZE.xs};
  font-family: ${FONT_FAMILY.secondary};

  ${(props) => {
    if (props.$role === 'Creator') {
      return css`
        animation: ${shimmerEffect} 3s linear infinite;
      `;
    } else if (props.$role === 'Admin') {
      return 'color: #FF0000;';
    } else if (props.$role === 'User') {
      return 'color: #0066CC;';
    } else {
      return `color: var(--${props.$color}-color);`;
    }
  }}
`;

export const DateText = styled(Title)`
  font-weight: ${FONT_WEIGHT.regular};
`;

export const Text = styled(BaseTypography.Text)`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  font-family: ${FONT_FAMILY.secondary};
`;
