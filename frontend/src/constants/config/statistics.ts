import { FC } from 'react';
import { ReactComponent as LangCultureIcon } from '@app/assets/icons/lang_culture.svg';
import { ReactComponent as ProgNetworksIcon } from '@app/assets/icons/prog_networks.svg';
import { ReactComponent as MathPhysicsIcon } from '@app/assets/icons/math_physics.svg';

export type StatisticColor = 'primary' | 'error' | 'secondary' | 'success';

interface ConfigStatistic {
  id: number;
  name: string;
  title: string;
  color: StatisticColor;
  Icon: FC;
}

export const statistics: ConfigStatistic[] = [
  {
    id: 1,
    name: 'math_physics',
    title: 'medical-dashboard.math_physics',
    color: 'success',
    Icon: MathPhysicsIcon,
  },
  {
    id: 2,
    name: 'Prog/Networks',
    title: 'medical-dashboard.prog_networks',
    color: 'error',
    Icon: ProgNetworksIcon,
  },
  {
    id: 3,
    name: 'Lang/Culture',
    title: 'medical-dashboard.lang_culture',
    color: 'primary',
    Icon: LangCultureIcon,
  },
];
