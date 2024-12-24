import { CategoryType } from '../categoriesList';

export interface Component {
  name: string;
  title: string;
  url: string;
  categories: CategoryType[];
  keywords: string[];
}

// TODO review and come up with a better approach for urls
// maybe we need to have enum with all routes like we had before?

// TODO change urls according to new dashboard routes and add new NFT components
export const components: Component[] = [
  {
    name: 'Homework types popularity',
    title: 'medical-dashboard.homeworkTypesPopularity.title',
    url: `/teachers-page/#homework-types-popularity`,
    categories: ['charts'],
    keywords: ['homework types popularity', 'charts', 'statistics'],
  },
  {
    name: 'Exam schedule',
    title: 'medical-dashboard.examPlan.title',
    url: `/teachers-page/#exam-plan`,
    categories: ['data tables'],
    keywords: ['exam schedule', 'data tables', 'doctor'],
  },
  {
    name: 'Activity',
    title: 'medical-dashboard.activity.title',
    url: `/teachers-page/#activity`,
    categories: ['charts'],
    keywords: ['activity', 'charts', 'statistics'],
  },
  {
    name: 'Covid',
    title: 'medical-dashboard.covid.title',
    url: `/teachers-page/#covid`,
    categories: ['charts'],
    keywords: ['covid', 'charts', 'statistics'],
  },
  {
    name: 'Patient timeline',
    title: 'medical-dashboard.patientResults.title',
    url: `/teachers-page/#patient-timeline`,
    categories: ['data tables'],
    keywords: ['patient timeline', 'data tables'],
  },
  {
    name: 'subjects',
    title: 'medical-dashboard.subjects.title',
    url: `/teachers-page/#subjects`,
    categories: ['charts'],
    keywords: ['health', 'charts'],
  },
  {
    name: 'Favorite doctors',
    title: 'medical-dashboard.favoriteDoctors.title',
    url: `/teachers-page/#favorite-doctors`,
    categories: ['data tables'],
    keywords: ['favorite doctors', 'data tables'],
  },
  {
    name: 'News',
    title: 'medical-dashboard.news',
    url: `/teachers-page/#news`,
    categories: ['data tables'],
    keywords: ['news', 'data tables'],
  },
  {
    name: 'Feed',
    title: 'common.feed',
    url: `/apps/feed`,
    categories: ['apps'],
    keywords: ['feed', 'apps'],
  },
  {
    name: 'Log in',
    title: 'common.login',
    url: `/auth/login`,
    categories: ['auth'],
    keywords: ['auth', 'log in', 'login'],
  },
  {
    name: 'Sign up',
    title: 'common.signup',
    url: `/auth/sign-up`,
    categories: ['auth'],
    keywords: ['auth', 'sign up', 'signup'],
  },
  {
    name: 'Ban',
    title: 'common.ban',
    url: `/ban`,
    categories: [],
    keywords: ['ban'],
  },
  {
    name: 'Dynamic form',
    title: 'forms.dynamicForm',
    url: `/forms/advanced-forms/#dynamic-form`,
    categories: ['forms'],
    keywords: ['dynamic form', 'forms'],
  },
  {
    name: 'Control form',
    title: 'forms.controlForm',
    url: `/forms/advanced-forms/#control-form`,
    categories: ['forms'],
    keywords: ['control form', 'forms'],
  },
  {
    name: 'Validation form',
    title: 'forms.validationForm',
    url: `/forms/advanced-forms/#validation-form`,
    categories: ['forms'],
    keywords: ['validation form', 'forms'],
  },
  {
    name: 'Step form',
    title: 'forms.stepForm',
    url: `/forms/advanced-forms/#step-form`,
    categories: ['forms'],
    keywords: ['step form', 'forms'],
  },
  {
    name: 'Basic table',
    title: 'tables.basicTable',
    url: `/data-tables/#basic-table`,
    categories: ['data tables'],
    keywords: ['basic table', 'data tables'],
  },
  {
    name: 'Editable table',
    title: 'tables.editableTeachersTable',
    url: `/data-tables/#editable-table`,
    categories: ['data tables'],
    keywords: ['editable table', 'data tables'],
  },
  {
    name: 'Tree table',
    title: 'tables.treeTable',
    url: `/data-tables/#tree-table`,
    categories: ['data tables'],
    keywords: ['tree table', 'data tables'],
  },
  {
    name: 'Personal info',
    title: 'profile.nav.personalInfo.title',
    url: `/profile/personal-info`,
    categories: ['data tables'],
    keywords: ['personal info', 'data tables'],
  },
  {
    name: 'Payments',
    title: 'profile.nav.payments.title',
    url: `/profile/payments`,
    categories: ['data tables'],
    keywords: ['payments', 'data tables'],
  },
  {
    name: 'Tutorial',
    title: 'Tutorial',
    url: `/how-to-use/tutorial`,
    categories: ['data tables'],
    keywords: ['how-to-use', 'data tables'],
  },
];
