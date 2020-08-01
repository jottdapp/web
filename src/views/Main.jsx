import React from 'react';
import styles from './Main.module.css';
import ThemeSwitcher from '../components/ThemeSwitcher';
import SettingsButton from '../components/SettingsButton';
import MainInput from '../components/MainInput';

export default function MainView() {
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
}
