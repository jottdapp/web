import { atom } from 'recoil';

// This default categories value is for testing use only.
export const categories = atom({
  key: 'categories',
  default: {
    cb: {
      type: 'Calendar',
      sharedWith: [],
    },
    cc: {
      type: 'Calendar',
      sharedWith: [],
    },
    tt: {
      type: 'Todo',
      sharedWith: ['Maya', 'Panda'],
    },
  },
});

export const username = atom({
  key: 'username',
  default: '',
});
