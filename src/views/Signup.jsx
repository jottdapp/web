import React, { useState } from 'react';
import { Link } from '@reach/router';
import { mdiAccount, mdiKey } from '@mdi/js';
import styles from './SignupLogin.module.css';
import IconInput from '../components/IconInput';

export default function SignupView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  let passwordStatus = '';
  if (password.length < 8) {
    passwordStatus = 'Passwords must be at least 8 characters long.';
  } else if (password.length > 128) {
    passwordStatus = 'Passwords are up to 128 characters long.';
  } else if (password !== confirmPassword) {
    passwordStatus = 'Passwords don\'t match.';
  } else if (password.length > 12) {
    passwordStatus = 'Passwords match.';
  } else {
    passwordStatus = 'Passwords match, but your password is short. Have you considered using a password manager?';
  }

  function submit() {
    alert(`username ${username} password ${password}`);
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
        { passwordStatus }
        <button className={styles.button} onClick={submit} type="button">Sign Up</button>
        <p>
          or&nbsp;
          <Link to="/login">log in</Link>
        </p>
      </div>
    </div>
  );
}
