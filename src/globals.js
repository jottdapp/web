import { atom } from 'recoil';

// This default categories value is for testing use only.
export const categories = atom({
  key: 'categories',
  default: {
    cb: '1e749a09-2dc1-4826-8281-d386a506d70a',
    cc: '530254aa-536b-4d07-bf72-7987ecf319f6',
    tt: '8900ad1a-5a23-4c08-99bc-1aa2f3c220b0',
    tw: '46caecbc-3bab-45b9-8ade-856c84b0526a',
  },
});

export const username = atom({
  key: 'username',
  default: '',
});
