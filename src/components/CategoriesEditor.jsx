import React from 'react';
import styles from './CategoriesEditor.module.css';

export default function CategoriesEditor({ categories, onChange }) {
  const keys = Object.keys(categories).sort();
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th style={{ minWidth: '80px' }}>Shortcut</th>
          <th style={{ minWidth: '100px' }}>What</th>
          <th style={{ minWidth: '100px' }}>Share</th>
        </tr>
      </thead>
      <tbody>
        { keys.map((key) => (
          <tr key={key}>
            <td><input value={key} size={key.length + 1} /></td>
            <td>{categories[key].type}</td>
            <td>{categories[key].sharedWith.join(', ')}</td>
          </tr>
        )) }
      </tbody>
    </table>
  );
}
