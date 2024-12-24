import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';
import SignUpPage from '@app/pages/SignUpPage';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import ProfileLayout from '@app/components/profile/ProfileLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
import NftDashboardPage from '@app/pages/DashboardPages/MainPage';
import TeachersPage from '@app/pages/DashboardPages/TeachersPage';
import TwoFAPage from '@app/pages/TwoFAPage';

const NewsFeedPage = React.lazy(() => import('@app/pages/HomeworksFeedPage'));
const ServerErrorPage = React.lazy(() => import('@app/pages/ServerErrorPage'));
const DataTableStudentsPage = React.lazy(() => import('@app/pages/DataTableStudentsPage'));
const DataTableTeachersPage = React.lazy(() => import('@app/pages/DataTableTeachersPage'));
const DataSubjectsTablePage = React.lazy(() => import('@app/pages/DataTableSubjectsPage'));
const DataHomeworksTablePage = React.lazy(() => import('@app/pages/DataTableHomeworksPage'));
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const PersonalInfoPage = React.lazy(() => import('@app/pages/PersonalInfoPage'));
const SecuritySettingsPage = React.lazy(() => import('@app/pages/SecuritySettingsPage'));
const PaymentsPage = React.lazy(() => import('@app/pages/PaymentsPage'));
const MyContentPage = React.lazy(() => import('@app/pages/MyContentPage'));
const TutorialPage = React.lazy(() => import('@app/pages/howToUsePage/TutorialPage'));
const Logout = React.lazy(() => import('./Logout'));

export const NFT_DASHBOARD_PATH = '/';
export const MEDICAL_DASHBOARD_PATH = '/teachers-page';

const MedicalDashboard = withLoading(TeachersPage);
const NftDashboard = withLoading(NftDashboardPage);
const NewsFeed = withLoading(NewsFeedPage);

// UI Components
const Tutorial = withLoading(TutorialPage);

const ServerError = withLoading(ServerErrorPage);
const Error404 = withLoading(Error404Page);

// Profile
const PersonalInfo = withLoading(PersonalInfoPage);
const MyContent = withLoading(MyContentPage);
const SecuritySettings = withLoading(SecuritySettingsPage);
const Payments = withLoading(PaymentsPage);

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

// Tables
const DataTableStudents = withLoading(DataTableStudentsPage);
const DataTableTeachers = withLoading(DataTableTeachersPage);
const DataSubjectsTable = withLoading(DataSubjectsTablePage);
const DataHomeworksTable = withLoading(DataHomeworksTablePage);

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
          <Route path="server-error" element={<ServerError />} />
          <Route path="404" element={<Error404 />} />
          <Route path="profile" element={<ProfileLayout />}>
            <Route path="personal-info" element={<PersonalInfo />} />
            <Route path="my-content" element={<MyContent />} />
            <Route path="security-settings" element={<SecuritySettings />} />
            <Route path="payments" element={<Payments />} />
          </Route>
          <Route path="data-tables">
            <Route path="students" element={<DataTableStudents />} />
            <Route path="teachers" element={<DataTableTeachers />} />
            <Route path="subjects" element={<DataSubjectsTable />} />
            <Route path="homeworks" element={<DataHomeworksTable />} />
          </Route>
          <Route path="how-to-use">
            <Route path="tutorial" element={<Tutorial />} />
          </Route>
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="2fa" element={<TwoFAPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
