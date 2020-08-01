import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import styles from './IconInput.module.css';

export default function IconInput(props) {
  const [showPassword, setShowPassword] = useState(false);
  if (props.type === 'password') {
    return (
      <div className={styles.IconInput}>
        <Icon className={styles.icon} size={0.8} path={props.icon} />
        <input {...props} type={showPassword ? 'text' : 'password'} />
        <Icon
          className={`${styles.icon} ${styles.passwordIcon}`}
          size={0.8}
          path={showPassword ? mdiEyeOff : mdiEye}
          onClick={() => setShowPassword(!showPassword)}
          style={{ cursor: 'pointer' }}
        />
      </div>
    );
  }
  return (
    <div className={styles.IconInput}>
      <Icon className={styles.icon} size={0.8} path={props.icon} />
      <input {...props} />
    </div>
  );
}

IconInput.propTypes = {
  icon: PropTypes.string,
  type: PropTypes.string,
};

IconInput.defaultProps = {
  icon: '',
  type: 'text',
};
