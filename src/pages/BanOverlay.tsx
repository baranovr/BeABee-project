import React from 'react';
import { useAppSelector, useAppDispatch } from '@app/hooks/reduxHooks';
import styled from 'styled-components';
import { doLogout } from '@app/store/slices/authSlice';
import { Button } from 'antd';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: #fff;
`;

const BanContent = styled.div`
  background: #1e1e2f;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 600px;
  width: 90%;
  
  .noting {
    color: #1e1e2f;
  }
`;

export const BanOverlay: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(doLogout());
    window.location.href = '/auth/login';
  };

  if (!user?.isBanned) {
    return null;
  }

  return (
    <Overlay>
      <BanContent>
        <h2>Your account has been blocked</h2>
        <p>
          <strong>Reason:</strong> {user.banReason || 'No reason :)'}
        </p>
        <p className={"noting"}>
          /
        </p>
        <p>
          If you believe this is a mistake, please contact support at{' '}
          <a href="mailto:support@example.com" style={{ color: '#ffa500' }}>
            beabee.official2425@gmail.com
          </a>.
        </p>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </BanContent>
    </Overlay>
  );
};
