import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { navigate } from '@reach/router';
import { stores } from '../globals';
import styles from './Settings.module.css';
import CategoriesEditor from '../components/CategoriesEditor';

export default function SettingsView() {
  const storesVal = useRecoilValue(stores);
  const [temporaryStores, setTemporaryStores] = useState(storesVal);
  if (storesVal === undefined) {
    navigate('/app');
    return <p>Redirecting to /app</p>;
  }
  return (
    <div className={styles.settings}>
      <h1>Settings</h1>
      <h2>Category configuration. This is a dummy table, it doesn&apos;t change anything.</h2>
      <CategoriesEditor categories={temporaryStores} onChange={setTemporaryStores} />
    </div>
  );
}
