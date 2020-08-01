import React, { useContext } from 'react';
import Icon from '@mdi/react';
import { mdiWhiteBalanceSunny, mdiWeatherNight } from '@mdi/js';
import ThemeContext from '../context/ThemeContext';
import styles from './CircleButton.module.css';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button className={styles.CircleButton} onClick={toggleTheme} type="button" aria-label="Switch between light and dark mode.">
      { theme === 'light' ? (
        <Icon
          path={mdiWhiteBalanceSunny}
          size={1.5}
        />
      ) : (
        <Icon
          path={mdiWeatherNight}
          size={1.5}
        />
      ) }

    </button>
  );
}
