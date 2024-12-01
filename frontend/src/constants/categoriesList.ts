export type CategoryType = 'apps' | 'forms' | 'charts' | 'auth' | 'data tables' | 'maps';

interface Category {
  name: CategoryType;
  title: string;
}

export const categoriesList: Category[] = [
  {
    name: 'apps',
    title: 'common.apps',
  },
  {
    name: 'auth',
    title: 'common.auth',
  },
  {
    name: 'forms',
    title: 'common.forms',
  },
  {
    name: 'data tables',
    title: 'common.dataTables',
  },
  {
    name: 'charts',
    title: 'common.charts',
  },
  {
    name: 'maps',
    title: 'common.maps',
  },
];

export type CategoryToFilterType = 'news' | 'im_info' | 'teachers' | 'homeworks' | 'users';

interface CategoryToFilter {
  name: CategoryToFilterType;
  title: string;
}

export const categoriesToFilterList: CategoryToFilter[] = [
  {
    name: 'news',
    title: 'common.news',
  },
  {
    name: 'im_info',
    title: 'common.im_info',
  },
  {
    name: 'teachers',
    title: 'common.teachers',
  },
  {
    name: 'homeworks',
    title: 'common.homeworks',
  },
  {
    name: 'users',
    title: 'common.users',
  },
];
