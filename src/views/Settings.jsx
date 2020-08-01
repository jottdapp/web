import React, { useState } from 'react';
import styles from './Settings.module.css';
import CategoriesEditor from '../components/CategoriesEditor';

export default function SettingsView() {
  const [temporaryCategories, setTemporaryCategories] = useState({
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
  });
  return (
    <div className={styles.settings}>
      <h1>Settings</h1>
      <h2>Category configuration</h2>
      <CategoriesEditor categories={temporaryCategories} onChange={setTemporaryCategories} />
    </div>
  );
}
