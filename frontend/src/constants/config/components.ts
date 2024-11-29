import { CategoryToFilterType } from '../categoriesList';

export interface Component {
  name: string;
  title: string;
  url: string;
  categories: CategoryToFilterType[];
  keywords: string[];
}

// TODO review and come up with a better approach for urls
// maybe we need to have enum with all routes like we had before?

// TODO change urls according to new dashboard routes and add new NFT components
export const components: Component[] = [
  {
    name: 'Activity',
    title: 'medical-dashboard.activity.title',
    url: `/medical-dashboard/#activity`,
    categories: ['charts'],
    keywords: ['activity', 'charts', 'statistics'],
  },
  {
    name: 'subjects',
    title: 'medical-dashboard.subjects.title',
    url: `/medical-dashboard/#subjects`,
    categories: ['charts'],
    keywords: ['health', 'charts'],
  },
  {
    name: 'Favorite doctors',
    title: 'medical-dashboard.favoriteDoctors.title',
    url: `/medical-dashboard/#favorite-doctors`,
    categories: ['teachers'],
    keywords: ['favorite doctors', 'data tables'],
  },
  {
    name: 'News',
    title: 'medical-dashboard.news',
    url: `/medical-dashboard/#news`,
    categories: ['news'],
    keywords: ['news', 'data tables'],
  },
  {
    name: 'Notifications (settings)', // Have to explain bcz user can understand it like a page with a list of his notifications
    title: 'profile.nav.notifications.settings',
    url: `/profile/notifications`,
    categories: ['data tables'],
    keywords: ['notifications', 'data tables'],
  },
  {
    name: 'Plans',
    title: 'common.plans',
    url: `/in-future/plans`,
    categories: ['data tables'],
    keywords: ['plans', 'data tables'],
  },
];
