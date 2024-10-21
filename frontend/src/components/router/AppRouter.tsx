import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';
import SignUpPage from '@app/pages/SignUpPage';
import BanPage from '@app/pages/BanPage';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import ProfileLayout from '@app/components/profile/ProfileLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
import NftDashboardPage from '@app/pages/DashboardPages/MainPage';
import TeachersPage from '@app/pages/DashboardPages/TeachersPage';

const NewsFeedPage = React.lazy(() => import('@app/pages/HomeworksFeedPage'));
const ServerErrorPage = React.lazy(() => import('@app/pages/ServerErrorPage'));
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const PersonalInfoPage = React.lazy(() => import('@app/pages/PersonalInfoPage'));
const NotificationsPage = React.lazy(() => import('@app/pages/NotificationsPage'));
const ResultsPage = React.lazy(() => import('@app/pages/inFuturePages/ResultsPage'));
const PlansPage = React.lazy(() => import('@app/pages/inFuturePages/PlansPage'));
const UploadsPage = React.lazy(() => import('@app/pages/inFuturePages/UploadsPage'));
const GoogleMaps = React.lazy(() => import('@app/pages/maps/GoogleMapsPage/GoogleMapsPage'));
const Logout = React.lazy(() => import('./Logout'));

export const NFT_DASHBOARD_PATH = '/';
export const MEDICAL_DASHBOARD_PATH = '/medical-dashboard';

const MedicalDashboard = withLoading(TeachersPage);
const NftDashboard = withLoading(NftDashboardPage);
const NewsFeed = withLoading(NewsFeedPage);

// UI Components
const Uploads = withLoading(UploadsPage);
const Results = withLoading(ResultsPage);
const Plans = withLoading(PlansPage);

// Maps
const Google = withLoading(GoogleMaps);

const ServerError = withLoading(ServerErrorPage);
const Error404 = withLoading(Error404Page);

// Profile
const PersonalInfo = withLoading(PersonalInfoPage);
const Notifications = withLoading(NotificationsPage);

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={NFT_DASHBOARD_PATH} element={protectedLayout}>
          <Route index element={<NftDashboard />} />
          <Route path={MEDICAL_DASHBOARD_PATH} element={<MedicalDashboard />} />
          <Route path="apps">
            <Route path="feed" element={<NewsFeed />} />
          </Route>
          <Route path="maps">
            <Route path="google-maps" element={<Google />} />
          </Route>
          <Route path="server-error" element={<ServerError />} />
          <Route path="404" element={<Error404 />} />
          <Route path="profile" element={<ProfileLayout />}>
            <Route path="personal-info" element={<PersonalInfo />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route path="in-future">
            <Route path="upload" element={<Uploads />} />
            <Route path="result" element={<Results />} />
            <Route path="plans" element={<Plans />} />
          </Route>
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route
            path="ban"
            element={
              <RequireAuth>
                <BanPage />
              </RequireAuth>
            }
          />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
