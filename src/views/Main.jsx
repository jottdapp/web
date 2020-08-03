import React from 'react';
import { navigate } from '@reach/router';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { appReady, loggedIn, stores } from '../globals';
import styles from './Main.module.css';
import ThemeSwitcher from '../components/ThemeSwitcher';
import SettingsButton from '../components/SettingsButton';
import MainInput from '../components/MainInput';

let listingStores = false;

export default function MainView() {
  const ready = useRecoilValue(appReady);
  const loggedInVal = useRecoilValue(loggedIn);
  const setStores = useSetRecoilState(stores);
  if (ready) {
    return (
      <div className={styles.MainPage}>
        <MainInput />
        <div className={styles.topRight}>
          <ThemeSwitcher />
          <div style={{ marginTop: '8px' }}>
            <SettingsButton />
          </div>
        </div>
      </div>
    );
  } if (loggedInVal) {
    // attempt to list stores asynchronously
    if (!listingStores) {
      listingStores = true;
      fetch('/api/store/list').then((r) => r.json()).then(setStores);
    }
    return <p>Loading</p>;
  }
  navigate('/login');
  return <p>Redirecting</p>;
}
