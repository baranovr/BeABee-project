import React from 'react';
import {
  CompassOutlined,
  FormOutlined,
  HomeOutlined,
  LayoutOutlined,
  UserOutlined,
  BlockOutlined,
} from '@ant-design/icons';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.nft-dashboard',
    key: 'nft-dashboard',
    // TODO use path variable
    url: '/',
    icon: <HomeOutlined />,
  },
  {
    title: 'common.medical-dashboard',
    key: 'medical-dashboard',
    url: '/medical-dashboard',
    icon: <FormOutlined />,
  },
  {
    title: 'common.apps',
    key: 'apps',
    icon: <LayoutOutlined />,
    children: [
      {
        title: 'common.feed',
        key: 'feed',
        url: '/apps/feed',
      },
    ],
  },
  {
    title: 'common.authPages',
    key: 'auth',
    icon: <UserOutlined />,
    children: [
      {
        title: 'common.login',
        key: 'login',
        url: '/auth/login',
      },
      {
        title: 'common.signUp',
        key: 'singUp',
        url: '/auth/sign-up',
      },
      {
        title: 'common.ban',
        key: 'ban',
        url: '/auth/ban',
      },
    ],
  },
  {
    title: 'common.maps',
    key: 'maps',
    icon: <CompassOutlined />,
    children: [
      {
        title: 'common.googleMap',
        key: 'google-maps',
        url: '/maps/google-maps',
      },
    ],
  },
  {
    title: 'common.pages',
    key: 'pages',
    icon: <LayoutOutlined />,
    children: [
      {
        title: 'common.profilePage',
        key: 'profile',
        url: '/profile',
      },
      {
        title: 'common.serverError',
        key: 'serverError',
        url: '/server-error',
      },
      {
        title: 'common.clientError',
        key: '404Error',
        url: '/404',
      },
    ],
  },
  {
    title: 'common.future',
    key: 'future',
    icon: <BlockOutlined />,
    children: [
      {
        title: 'Plans',
        key: 'plans',
        url: '/in-future/plans',
      },
    ],
  },
];
