import { themeObject } from '@app/styles/themes/themeVariables';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { ChartData, xData } from '@app/interfaces/interfaces';
import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';

interface CovidData {
  title: string;
  data: ChartData;
}

export const CovidChart: React.FC<{
  confirmed: CovidData;
  deaths: CovidData;
  dateArr: xData;
}> = ({ confirmed, deaths, dateArr }) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const option = {
    color: [themeObject[theme].chartPrimaryGradient, themeObject[theme].chartSecondaryGradientSpecular],
    grid: [
      {
        top: 10,
        left: 10,
        right: 0,
        height: '50%',
        containLabel: true,
      },
      {
        left: 26.5,
        right: 0,
        top: '50%',
        height: '45%',
        containLabel: true,
      },
    ],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: dateArr,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: confirmed.title,
        data: confirmed.data,
        type: 'line',
        areaStyle: {},
        smooth: true,
        lineStyle: {
          width: 2,
          color: themeObject[theme].chartColor1,
        },
      },
      {
        name: deaths.title,
        data: deaths.data,
        type: 'line',
        areaStyle: {},
        smooth: true,
        lineStyle: {
          width: 2,
          color: themeObject[theme].chartColor5,
        },
      },
    ],
    tooltip: {
      ...getDefaultTooltipStyles(themeObject[theme]),
      trigger: 'axis',
    },
  };

  return <BaseChart option={option} height="100%" />;
};
