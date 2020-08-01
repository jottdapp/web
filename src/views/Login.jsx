import React, { useState } from 'react';
import { Link, navigate } from '@reach/router';
import { mdiAccount, mdiKey } from '@mdi/js';
import styles from './SignupLogin.module.css';
import IconInput from '../components/IconInput';

export default function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [waitingForServer, setWaitingForServer] = useState(false);
  const [errorDetail, setErrorDetail] = useState('');

  async function submit() {
    setWaitingForServer(true);
    console.log(`username ${username} password ${password}`);
    const response = await fetch(`${window.location.origin}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }, null, 0),
    });
    const json = await response.json();
    if (response.status === 400) {
      // error, look for key "detail"
      setErrorDetail(json.detail);
      setWaitingForServer(false);
    } else if (response.status === 200) {
      // success!
      navigate('/app');
    }
  }

  return (
    <div className={styles.SignupLoginPage}>
      <div className={styles.SignupLoginForm}>
        <h1>Log In</h1>
        <IconInput disabled={waitingForServer} icon={mdiAccount} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <div style={{ margin: '4px 0' }}>
          <IconInput disabled={waitingForServer} icon={mdiKey} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
        </div>
        {waitingForServer ? (
          <p>Waiting...</p>
        ) : (
          <p style={{ color: 'var(--error-color)' }}>{ errorDetail }</p>
        )}
        <button disabled={waitingForServer} className={styles.button} onClick={submit} type="button">Log In</button>
        <p>
          or&nbsp;
          <Link to="/signup">sign up</Link>
        </p>
      </div>
    </div>
  );
}
