import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { WithChildrenProps } from '@app/types/generalTypes';

const RequireAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const auth = useAppSelector((state) => state.auth);
  const token = auth?.accessToken;

  return token ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export default RequireAuth;
