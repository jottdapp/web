import { atom, selector } from 'recoil';
import { get as getCookie } from 'web-cookies';
import Todo from './components/views/Todo';

export const stores = atom({
  key: 'stores',
  default: undefined,
});

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

  return JSON.parse(jsonPayload);
}

export function getJwt() {
  let jwt;
  try {
    jwt = parseJwt(getCookie('session'));
  } catch (e) { /* this throws an error if this is not a jwt */ }
  return jwt;
}

export const jwt = atom({
  key: 'jwt',
  default: getJwt(),
});

export const username = selector({
  key: 'username',
  get: ({ get }) => {
    const jwtVal = get(jwt);
    if (jwtVal) {
      return jwtVal.usr;
    }
    return undefined;
  },
});

export const loggedIn = selector({
  key: 'loggedIn',
  get: ({ get }) => {
    const jwtVal = get(jwt);
    if (jwtVal) {
      return jwtVal.exp > Date.now() / 1000;
    }
    return false;
  },
});

export const appReady = selector({
  key: 'appReady',
  get: ({ get }) => {
    const categoriesValue = get(stores);
    return categoriesValue !== undefined;
  },
});
export const SUPPORTED_VIEWS = { Todo };
