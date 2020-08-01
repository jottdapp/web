import React from 'react';
import Icon from '@mdi/react';
import { mdiCog } from '@mdi/js';
import { Link } from '@reach/router';
import styles from './CircleButton.module.css';

export default function ThemeSwitcher() {
  return (
    <Link to="/settings">
      <button className={styles.CircleButton} type="button" aria-label="Settings.">
        <Icon
          path={mdiCog}
          size={1.5}
        />
      </button>
    </Link>
  );
}
