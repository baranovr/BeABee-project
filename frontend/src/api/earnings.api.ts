import { CurrencyTypeEnum } from '@app/interfaces/interfaces';

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Balance {
  UAN: number;
  USD: number;
  ETH: number;
  BTC: number;
}

export interface Earning {
  date: number;
  usd_value: number;
}

export interface TotalEarning {
  total: number;
  prevTotal: number;
  currency: CurrencyTypeEnum;
  timeline: Earning[];
}

export const getBalance = (id: number): Promise<Balance> => {
  return new Promise((res) => {
    setTimeout(() => {
      res({
        UAN: 1290,
        USD: 30.0,
        ETH: 1040.51,
        BTC: 0.00001,
      });
    }, 0);
  });
};

export const getTotalEarning = (id: number, currency: CurrencyTypeEnum): Promise<TotalEarning> => {
  return new Promise((res) => {
    setTimeout(() => {
      res({
        total: 1290,
        prevTotal: 120,
        currency: CurrencyTypeEnum.UAN,
        timeline: [
          {
            date: Date.now() - 1000 * 60 * 60 * 24 * 7,
            usd_value: 10,
          },
          {
            date: Date.now() - 1000 * 60 * 60 * 24 * 6,
            usd_value: 20,
          },
          {
            date: Date.now() - 1000 * 60 * 60 * 24 * 5,
            usd_value: 5,
          },
          {
            date: Date.now() - 1000 * 60 * 60 * 24 * 4,
            usd_value: 35,
          },
          {
            date: Date.now() - 1000 * 60 * 60 * 24 * 3,
            usd_value: 20,
          },
          {
            date: Date.now() - 1000 * 60 * 60 * 24 * 2,
            usd_value: 30,
          },
          {
            date: Date.now() - 1000 * 60 * 60 * 24,
            usd_value: 32,
          },
        ],
      });
    }, 0);
  });
};
