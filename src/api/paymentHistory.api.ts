import { CurrencyTypeEnum } from '@app/interfaces/interfaces';

export interface Payment {
  id: number;
  recipient: string;
  date: number;
  status: number;
  amount: number;
  currency: CurrencyTypeEnum;
  imgUrl: string;
}

export const getPaymentHistory = (): Promise<Payment[]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res([
        {
          id: 1,
          recipient: 'Render',
          date: 1626037200000,
          status: 1,
          amount: 25,
          currency: CurrencyTypeEnum.USD,
          imgUrl: 'https://pbs.twimg.com/profile_images/1735429515541938176/zOO1N7Su_400x400.jpg',
        },
        {
          id: 2,
          recipient: 'Elephant SQL',
          date: 1626037200000,
          status: 1,
          amount: 5,
          currency: CurrencyTypeEnum.USD,
          imgUrl: 'https://pbs.twimg.com/profile_images/2661035254/f1797e21af006ca889d3e5f39293fca1_400x400.png',
        },
      ]);
    }, 0);
  });
};
