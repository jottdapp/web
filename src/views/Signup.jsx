import React, { useState } from 'react';
import { Link, navigate } from '@reach/router';
import { mdiAccount, mdiKey } from '@mdi/js';
import styles from './SignupLogin.module.css';
import IconInput from '../components/IconInput';

export default function SignupView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [waitingForServer, setWaitingForServer] = useState(false);
  const [errorDetail, setErrorDetail] = useState('');

  let passwordStatus = '';
  let disabledButton = false;
  if (password.length < 8) {
    passwordStatus = 'Passwords must be at least 8 characters long.';
    disabledButton = true;
  } else if (password.length > 128) {
    passwordStatus = 'Passwords are up to 128 characters long.';
    disabledButton = true;
  } else if (password !== confirmPassword) {
    passwordStatus = 'Passwords don\'t match.';
    disabledButton = true;
  } else if (password.length > 12) {
    passwordStatus = 'Passwords match.';
  } else {
    passwordStatus = 'Passwords match, but your password is short. Have you considered using a password manager?';
  }

  async function submit() {
    setWaitingForServer(true);
    const response = await fetch(`${window.location.origin}/api/auth/signup`, {
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
        <h1>Sign Up</h1>
        <IconInput icon={mdiAccount} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <div style={{ margin: '4px 0' }}>
          <IconInput icon={mdiKey} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
        </div>
        <div style={{ marginBottom: '4px' }}>
          <IconInput icon={mdiKey} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="confirm password" type="password" />
        </div>
        <p>{passwordStatus}</p>
        {waitingForServer ? (
          <p>Waiting...</p>
        ) : (
            <p style={{ color: 'var(--error-color)' }}>{errorDetail}</p>
          )}
        <button disabled={disabledButton} className={styles.button} onClick={submit} type="button">Sign Up</button>
        <p>
          or&nbsp;
          <Link to="/login">log in</Link>
        </p>
      </div>
    </div>
  );
}
