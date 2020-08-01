import { atom } from 'recoil';

export const categories = atom({
  key: 'categories',
  default: {},
});

export const username = atom({
  key: 'username',
  default: '',
});
