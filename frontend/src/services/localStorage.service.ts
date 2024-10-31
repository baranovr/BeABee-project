import { UserModel } from '@app/domain/UserModel';

export const persistToken = (token: string, type: 'access' | 'refresh'): void => {
  localStorage.setItem(`${type}Token`, token);
};

export const readToken = (type: 'access' | 'refresh'): string | null => {
  return localStorage.getItem(`${type}Token`);
};

export const deleteToken = (type: 'access' | 'refresh'): void => {
  localStorage.removeItem(`${type}Token`);
};

export const persistUser = (user: UserModel): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const readUser = (): UserModel | null => {
  const userStr = localStorage.getItem('user');

  // Проверяем наличие значения в userStr
  return userStr ? JSON.parse(userStr) : null;
};

export const deleteUser = (): void => {
  localStorage.removeItem('user');
};
