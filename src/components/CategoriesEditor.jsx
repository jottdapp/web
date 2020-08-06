import React, { useState } from 'react';
import clone from 'lodash/clone';
import { mdiDelete } from '@mdi/js';
import Icon from '@mdi/react';
import { useRecoilState } from 'recoil';
import styles from './CategoriesEditor.module.css';
import { stores as storesAtom } from '../globals';

let savingCounter = 0;
export default function CategoriesEditor() {
  const [realStores, setRealStores] = useRecoilState(storesAtom);
  const [stores, setStores] = useState(realStores);
  const items = Object.entries(stores).sort((a, b) => a[1].uuid < b[1].uuid);

  async function handleChange(originalShortcut, event) {
    if (event.target.value === '') {
      return;
    }
    const newStores = clone(stores);
    if (stores[event.target.value] === undefined) {
      delete newStores[originalShortcut];
    } else {
      newStores[originalShortcut] = stores[event.target.value];
    }
    newStores[event.target.value] = stores[originalShortcut];
    setStores(newStores);
    // tell the database
    if (stores[event.target.value] === undefined) {
      // regular change
      savingCounter += 1;
      const response = await fetch('/api/store/edit-shortcut', {
        method: 'POST',
        body: JSON.stringify({
          store_uuid: stores[originalShortcut].uuid,
          shortcut: event.target.value,
        }),
      });
      let json;
      try {
        json = await response.json();
      } catch (e) {
        alert('error in saving');
      }
      savingCounter -= 1;
      if (json !== undefined && response.status !== 200) {
        alert(json);
      } else {
        setRealStores(newStores);
      }
    } else {
      // swap change, make a temporary name for one of them
      alert('this is a conflict, swap changes aren\'t implemented yet');
      setStores(realStores);
    }
  }

  async function addTodo() {
    savingCounter += 1;
    const shortcut = prompt('shortcut (it is only like this because we didn\'t have time)');
    const response = await fetch('/api/store/new', {
      method: 'POST',
      body: JSON.stringify({
        view: 'Todo',
        shortcut,
      }, null, 0),
    });
    const json = await response.json();
    const newStores = clone(stores);
    newStores[shortcut] = {
      uuid: json,
      view: 'Todo',
    };
    setStores(newStores);
    setRealStores(newStores);
    savingCounter -= 1;
  }

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ minWidth: '80px' }}>Shortcut</th>
            <th style={{ minWidth: '100px' }}>What</th>
            <td />
          </tr>
        </thead>
        <tbody>
          { items.map(([key, val]) => (
            <tr key={val.uuid}>
              <td><input value={key} onChange={handleChange.bind(undefined, key)} /></td>
              <td>{val.view}</td>
              <td className="buttonArea">
                <button type="button" label="Delete">
                  <Icon path={mdiDelete} size={1} />
                </button>
              </td>
            </tr>
          )) }
        </tbody>
      </table>
      <button type="button" onClick={addTodo}>Add todo</button>
      <p>{ savingCounter === 0 ? 'Saved.' : 'Saving, don\'t exit this menu...' }</p>
    </div>
  );
}
