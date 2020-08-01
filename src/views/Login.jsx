import React, { useState } from 'react';
import { Link } from '@reach/router';
import { mdiAccount, mdiKey } from '@mdi/js';
import styles from './SignupLogin.module.css';
import IconInput from '../components/IconInput';

export default function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function submit() {
    alert(`username ${username} password ${password}`);
  }

  return (
    <div className={styles.SignupLoginPage}>
      <div className={styles.SignupLoginForm}>
        <h1>Log In</h1>
        <IconInput icon={mdiAccount} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <div style={{ margin: '4px 0' }}>
          <IconInput icon={mdiKey} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
        </div>
        <button className={styles.button} onClick={submit} type="button">Log In</button>
        <p>
          or&nbsp;
          <Link to="/signup">sign up</Link>
        </p>
      </div>
    </div>
  );
}
