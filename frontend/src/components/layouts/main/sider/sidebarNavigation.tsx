import React from 'react';
import {
  FormOutlined,
  HomeOutlined,
  LayoutOutlined,
  TableOutlined,
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
    url: '/',
    icon: <HomeOutlined />,
  },
  {
    title: 'common.medical-dashboard',
    key: 'medical-dashboard',
    url: '/teachers-page',
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
    title: 'common.dataTables',
    key: 'dataTables',
    icon: <TableOutlined />,
    children: [
      {
        title: 'Students',
        key: 'students',
        url: '/data-tables/students',
      },
      {
        title: 'Teachers',
        key: 'teacher',
        url: '/data-tables/teachers',
      },
      {
        title: 'Subjects',
        key: 'subjects',
        url: '/data-tables/subjects',
      },
      {
        title: 'Homeworks',
        key: 'homeworks',
        url: '/data-tables/homeworks',
      },
    ],
  },
  {
    title: 'How to use?',
    key: 'how-to-use',
    icon: <BlockOutlined />,
    children: [
      {
        title: 'Tutorials',
        key: 'tutorial',
        url: '/how-to-use/tutorial',
      },
    ],
  },
];
