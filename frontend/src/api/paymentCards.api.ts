import { cardThemes } from '@app/constants/cardThemes';
import { PaymentCard } from '@app/interfaces/interfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPaymentCards = (id: number): Promise<PaymentCard[]> =>
  new Promise((res) =>
    setTimeout(
      () =>
        res([
          {
            name: 'Example Card',
            cvc: '144',
            expiry: '11/24',
            number: '4255 2003 0168 9006',
            focused: '',
            background: cardThemes[0].background,
            isEdit: false,
          },
          {
            name: 'Example Card',
            cvc: '345',
            expiry: '12/22',
            number: '4255 1000 2046 8006',
            focused: '',
            background: cardThemes[5].background,
            isEdit: false,
          },
        ]),
      0,
    ),
  );
