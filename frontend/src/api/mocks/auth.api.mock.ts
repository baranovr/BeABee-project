import { httpApiMock } from '@app/api/mocks/http.api.mock';
import { AuthData } from '@app/api/auth.api';
import { initValues } from '@app/components/auth/LoginForm/LoginForm';

const avatarImg = process.env.REACT_APP_ASSETS_BUCKET + '/avatars/avatar5.webp';

httpApiMock.onPost('login').reply((config) => {
  const data: AuthData = JSON.parse(config.data || '');
  if (data.password === initValues.password) {
    return [
      200,
      {
        token: 'bearerToken',
        user: {
          id: 1,
          firstName: 'Chris',
          lastName: 'Johnson',
          imgUrl: avatarImg,
          userName: '@john1989',
          email: 'chris.johnson@altence.com',
          phone: '+18143519459',
          sex: 'male',
          birthday: '01/26/2022',
          lang: 'en',
          country: 'GB',
          city: 'London',
          address1: '14 London Road',
          zipcode: 5211,
          website: 'altence.com',
          socials: {
            instagram: '@altence_team',
            facebook: 'https://facebook.com/groups/1076577369582221',
            linkedin: 'https://linkedin.com/company/altence',
            github: 'https://linkedin.com/company/altence/',
          },
        },
      },
    ];
  } else return [401, { message: 'Invalid Credentials' }];
});

httpApiMock.onPost('signUp').reply(200);
